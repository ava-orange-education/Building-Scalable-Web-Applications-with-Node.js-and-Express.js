import express from 'express';
import { validationResult } from 'express-validator';


export interface IValidationError {
    type?: string;
    msg?: string;
    path?: string;
    location?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (validations: Array<any>) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // Run all the validation middleware functions and wait for them to complete
        await Promise.all(validations.map(validation => validation.run(req)));

        // Get the validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // If there are no validation errors, move to the next middleware
            return next();
        }

        // If there are validation errors, format them and send a response with a 400 status
        const errorMessages = errors.array().map((error: IValidationError) => {
            const obj = {};
            obj[error.path] = error.msg;
            return obj;
        });
        return res.status(400).json({ 'statusCode': 400, 'status': 'error', errors: errorMessages });

    };
};
