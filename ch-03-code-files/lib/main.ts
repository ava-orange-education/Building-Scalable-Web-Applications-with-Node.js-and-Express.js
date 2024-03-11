import express, { Application, Request, Response, NextFunction } from 'express';
import { HttpException, NotFoundException } from './utils/errorHandler';
import * as bodyParser from 'body-parser';
import { users, Users } from "./users/user";
import path from 'path';

const app: Application = express();

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res, next) => {
    const userId = req.params.id;
    const user = new Users();
    const isUserExist = user.getUserById(userId);

    if (!isUserExist) {
        return next(new NotFoundException(`User with ID ${userId} not found`));
    }

    res.status(200).json(user);

});

// Async function that throws an error
async function asyncFunction(): Promise<void> {
    throw new Error('Async error');
}

// Async route handler that calls the async function
app.get('/async-error', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await asyncFunction();
        res.send('Success');
    } catch (error) {
        next(error);
    }
});
// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(500).send('Something broke!');
});

app.use(express.static('public'));

app.get('/ejs', (req, res) => {
    const data = {
        title: 'My App',
        message: 'Hello, I am from EJS !!'
    };
    res.render('index', data);
});


app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
