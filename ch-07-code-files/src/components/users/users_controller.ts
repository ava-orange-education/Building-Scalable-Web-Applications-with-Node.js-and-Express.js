import { Response, Request } from 'express';
import { BaseController } from '../../utils/base_controller';
import { SERVER_CONST, bcryptCompare, encryptString } from '../../utils/common';
import { RolesUtil } from '../roles/roles_controller';
import { UsersService } from './users_service';
import * as jwt from 'jsonwebtoken';
import { hasPermission } from '../../utils/auth_util';
import { sendMail } from '../../utils/email_util';
import { Users } from './users_entity';
import * as config from '../../../server_config.json';
import { CacheUtil } from '../../utils/cache_util';

export class UserController extends BaseController {

    /**
     * Handles the addition of a new user.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     */
    public async addHandler(req: Request, res: Response): Promise<void> {

        if (!hasPermission(req.user.rights, 'add_user')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }

        try {
            // Create an instance of the UsersService
            const service = new UsersService();

            // Extract user data from the request body
            const user = req.body;

            // Check if the provided role_ids are valid
            const isValidRole = await RolesUtil.checkValidRoleIds([user.role_id]);

            if (!isValidRole) {
                // If role_ids are invalid, send an error response
                res.status(400).json({ statusCode: 400, status: 'error', message: 'Invalid role_ids' });
                return;
            }
            // Convert email and username to lowercase (if present)
            user.email = user.email?.toLowerCase();
            user.username = user.username?.toLowerCase();

            // Encrypt the user's password
            user.password = await encryptString(user.password);

            // If role_ids are valid, create the user
            const createdUser = await service.create(user);
            res.status(createdUser.statusCode).json(createdUser);

        } catch (error) {
            // Handle errors and send an appropriate response
            console.error(`Error while addUser => ${error.message}`);
            res.status(500).json({ statusCode: 500, status: 'error', message: 'Internal server error' });
        }
    }

    public async getAllHandler(req: Request, res: Response): Promise<void> {

        if (!hasPermission(req.user.rights, 'get_all_users')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        const service = new UsersService();
        const result = await service.findAll(req.query);
        if (result.statusCode === 200) {
            // Remove password field to send in response
            result.data.forEach(i => delete i.password);
        }
        res.status(result.statusCode).json(result);
        return;
    }


    public async getOneHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'get_details_user')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }

        // check user is in cache
        const userFromCache = await CacheUtil.get('User', req.params.id);
        if (userFromCache) {
            res.status(200).json({ statusCode: 200, status: 'success', data: userFromCache });
            return;
        } else {
            // get user from db
            const service = new UsersService();
            const result = await service.findOne(req.params.id);
            if (result.statusCode === 200) {
                delete result.data.password;
                // set user in cache
                CacheUtil.set('User', req.params.id, result.data);
            }
            res.status(result.statusCode).json(result);
            return;
        }
    }

    public async updateHandler(req: Request, res: Response): Promise<void> {

        if (!hasPermission(req.user.rights, 'edit_user')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }

        const service = new UsersService();
        const user = req.body;

        // we will not update email and username once inserted so remove it from body 
        delete user?.email;
        delete user?.username;

        // we will also not update password from here it will be from changePassword function separate
        delete user?.password;

        const result = await service.update(req.params.id, user);
        if (result.statusCode === 200) {
            delete result.data.password;
        }
        res.status(result.statusCode).json(result);
        return;
    }

    public async deleteHandler(req: Request, res: Response): Promise<void> {
        if (!hasPermission(req.user.rights, 'delete_user')) {
            res.status(403).json({ statusCode: 403, status: 'error', message: 'Unauthorised' });
            return;
        }
        const service = new UsersService();
        const result = await service.delete(req.params.id);

        // remove user from cache
        CacheUtil.remove('User', req.params.id);

        res.status(result.statusCode).json(result);
        return;
    }


    /**
     * Handles user login by checking credentials, generating tokens, and responding with tokens.
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        const service = new UsersService();

        // Find user by email
        const result = await service.findAll({ email: email });
        if (result.data.length < 1) {
            res.status(404).json({ statusCode: 404, status: 'error', message: 'Email not found' });
            return;
        } else {
            const user = result.data[0];

            // Compare provided password with stored hashed password
            const comparePasswords = await bcryptCompare(password, user.password);
            if (!comparePasswords) {
                res.status(400).json({ statusCode: 400, status: 'error', message: 'Password is not valid' });
                return;
            }

            // Generate access and refresh tokens
            const accessToken: string = jwt.sign({
                email: user.email,
                username: user.username,
            }, SERVER_CONST.JWTSECRET, { expiresIn: SERVER_CONST.ACCESS_TOKEN_EXPIRY_TIME_SECONDS });

            const refreshToken: string = jwt.sign({
                email: user.email,
                username: user.username,
            }, SERVER_CONST.JWTSECRET, { expiresIn: SERVER_CONST.REFRESH_TOKEN_EXPIRY_TIME_SECONDS });

            // Respond with tokens
            res.status(200).json({ statusCode: 200, status: 'success', data: { accessToken, refreshToken } });
            return;
        }
    }

    /**
     * Generates a new access token using a valid refresh token.
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    public async getAccessTokenFromRefreshToken(req: Request, res: Response): Promise<void> {
        // Get the refresh token from the request body
        const refreshToken = req.body.refreshToken;

        // Verify the refresh token
        jwt.verify(refreshToken, SERVER_CONST.JWTSECRET, (err, user) => {
            if (err) {
                // If refresh token is invalid, send a 403 error response
                res.status(403).json({ statusCode: 403, status: 'error', message: 'Invalid Refresh Token' });
                return;
            }
            // getting the user is missing here

            // Generate a new access token using user information from the refresh token
            const accessToken = jwt.sign(user, SERVER_CONST.JWTSECRET, { expiresIn: SERVER_CONST.ACCESS_TOKEN_EXPIRY_TIME_SECONDS });

            // Respond with the new access token
            res.status(200).json({ statusCode: 200, status: 'success', data: { accessToken } });
            return;
        });
    }

    public async changePassword(req: Request, res: Response): Promise<void> {
        const { oldPassword, newPassword } = req.body;

        const service = new UsersService();
        const findUserResult = await service.findOne(req.params.id);
        if (findUserResult.statusCode !== 200) {
            res.status(404).send({ statusCode: 404, status: 'error', message: 'User Not Found' });
            return;
        }
        const user = findUserResult.data;

        // check requested user_id and session user_id is same 
        if (user?.username !== req.user.username) {
            res.status(400).send({ statusCode: 400, status: 'error', message: 'User can change only own password' });
            return;
        }

        // verify old password is valid 
        const comparePasswords = await bcryptCompare(oldPassword, user.password);
        if (!comparePasswords) {
            res.status(400).json({ statusCode: 400, status: 'error', message: 'oldPassword is not matched' });
            return;
        }

        // Encrypt the user's new password
        user.password = await encryptString(newPassword);
        const result = await service.update(req.params.id, user);
        if (result.statusCode === 200) {
            res.status(200).json({ statusCode: 200, status: 'success', message: 'Password is updated successfully' });
            return;
        } else {
            res.status(result.statusCode).json(result);
            return;
        }
    }
    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            res.status(400).send({ statusCode: 400, status: 'error', message: 'Invalid email' });
            return;
        }
        const user: Users = await UsersUtil.getUserByEmail(email);
        if (!user) {
            res.status(404).send({ statusCode: 404, status: 'error', message: 'User Not Found' });
            return;
        }
        // Generate a reset token for the user
        const resetToken: string = jwt.sign({ email: user.email }, SERVER_CONST.JWTSECRET, {
            expiresIn: '1h',
        });

        // Generate the reset link
        const resetLink = `${config.front_app_url}/reset-password?token=${resetToken}`;
        const mailOptions = {
            to: email,
            subject: 'Password Reset',
            html: ` Hello ${user.username},<p>We received a request to reset your password. If you didn't initiate this request, please ignore this email.</p>
           <p>To reset your password, please click the link below:</p>
           <p><a href="${resetLink}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a></p>
           <p>If the link doesn't work, you can copy and paste the following URL into your browser:</p>
           <p>${resetLink}</p>
           <p>This link will expire in 1 hour for security reasons.</p>
           <p>If you didn't request a password reset, you can safely ignore this email.</p>
           <p>Best regards,<br>PMS Team</p>`,
        };
        const emailStatus = await sendMail(mailOptions.to, mailOptions.subject, mailOptions.html);
        if (emailStatus) {
            res.status(200).json({ statusCode: 200, status: 'success', message: 'Reset Link sent on your mailId', data: { 'resetToken': resetToken } });
        } else {
            res.status(400).json({ statusCode: 400, status: 'error', message: 'something went wrong try again' });
        }
        return;
    }

    public async resetPassword(req: Request, res: Response): Promise<void> {

        const { newPassword, token } = req.body;
        const service = new UsersService();
        let email;

        try {
            const decoded = jwt.verify(token, SERVER_CONST.JWTSECRET);
            if (!decoded) {
                throw new Error('Invalid Reset Token');
            }
            email = decoded['email'];
        } catch (error) {
            res.status(400).json({ statusCode: 400, status: 'error', message: 'Reset Token is invalid or expired' }).end();
            return;
        }

        try {
            const user = await UsersUtil.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ statusCode: 404, status: 'error', message: 'User not found' }).end();
                return;
            }

            // Encrypt the user's new password
            user.password = await encryptString(newPassword);
            const result = await service.update(user.user_id, user);

            if (result.statusCode === 200) {
                res.status(200).json({ statusCode: 200, status: 'success', message: 'Password updated successfully' });
            } else {
                res.status(result.statusCode).json(result).end();
            }
        } catch (error) {
            console.error(`Error while resetPassword => ${error.message}`);
            res.status(500).json({ statusCode: 500, status: 'error', message: 'Internal Server error' }).end();
        }

    }
}

export class UsersUtil {

    // function to put all users in cache
    public static async putAllUsersInCache() {
        const userService = new UsersService();
        const result = await userService.findAll({});
        if (result.statusCode === 200) {
            const users = result.data;
            users.forEach(i => {
                CacheUtil.set('User', i.user_id, i);
            });
            console.log(`All users are put in cache`);
        } else {
            console.log(`Error while putAllUsersInCache() => ${result.message}`);
            console.log(result);
        }
    }

    public static async getUserFromUsername(username: string) {
        try {
            if (username) {
                const service = new UsersService();
                const users = await service.customQuery(`username = '${username}'`);
                if (users && users.length > 0) {
                    return users[0];
                }
            }

        } catch (error) {
            console.error(`Error while getUserFromToken() => ${error.message}`);
        }
        return null;
    }
    public static async getUserByEmail(email: string) {
        try {
            if (email) {
                const service = new UsersService();
                const users = await service.customQuery(`email = '${email}'`);
                if (users && users.length > 0) {
                    return users[0];
                }
            }

        } catch (error) {
            console.error(`Error while getUserFromToken() => ${error.message}`);
        }
        return null;
    }

    public static async checkValidUserIds(user_ids: string[]) {
        const userService = new UsersService();

        // Query the database to check if all user_ids are valid
        const users = await userService.findByIds(user_ids);

        // Check if all user_ids are found in the database
        return users.data.length === user_ids.length;
    }
    public static async getUsernamesById(user_ids: string[]) {
        const userService = new UsersService();

        // Query the database to check if all user_ids are valid
        const queryResult = await userService.findByIds(user_ids);
        if (queryResult.statusCode === 200) {
            const users = queryResult.data;
            const usernames = users.map((i) => {
                return {
                    'username': i.username,
                    'user_id': i.user_id
                };
            });
            return usernames;
        }
        return [];

    }

    public static async getUserById(user_id: string) {
        const userService = new UsersService();

        const queryResult = await userService.findOne(user_id);
        if (queryResult.statusCode === 200) {
            const user = queryResult.data;
            return user;
        }
        return null;
    }
}