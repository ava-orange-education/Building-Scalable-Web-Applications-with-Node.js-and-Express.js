declare namespace Express {
    interface Request {
        user?: {
            username?: string;
            email?: string;
            rights?: string[];
            user_id?: string;
        };
        // Add any other custom properties you need
    }
}
