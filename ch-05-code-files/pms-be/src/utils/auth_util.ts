import * as jwt from 'jsonwebtoken';
import { SERVER_CONST } from './common';
import { UsersUtil } from '../components/users/users_controller';
import { RolesUtil } from '../components/roles/roles_controller';
import { NextFunction, Request, Response } from 'express';
import { Users } from '../components/users/users_entity';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {

    // Get the access token from the request headers
    const token = req.headers?.authorization ? req.headers?.authorization?.split('Bearer ')[1] as string : null;
    if (!token) {
        return res.status(401).json({ statusCode: 401, status: 'error', message: 'Missing Authorization Token' });
    }

    try {
        // Verify the access token
        const decodedToken = jwt.verify(token, SERVER_CONST.JWTSECRET);
        req.user = {};
        req.user.user_id = decodedToken['user_id'] ?? '';
        req.user.username = decodedToken['username'] ?? '';
        req.user.email = decodedToken['email'] ?? '';
        if (req.user.username) {
            const user: Users = await UsersUtil.getUserFromUsername(req.user.username);
            const rights = await RolesUtil.getAllRightsFromRoles([user.role_id]);
            req.user.rights = rights;
        }
        // Authorized, proceed to the next middleware
        next();

    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ statusCode: 401, status: 'error', message: 'Invalid Token' });
    }
};

export const hasPermission = (rights: string[], desired_rights: string): boolean => {
    if (rights?.includes(desired_rights)) {
        return true;
    } else {
        return false;
    }
};
