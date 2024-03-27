import { Request, Response } from 'express';

export abstract class BaseController {
    public abstract addHandler(req: Request, res: Response): void;
    public abstract getAllHandler(req: Request, res: Response): void;
    public abstract getOneHandler(req: Request, res: Response): void;
    public abstract updateHandler(req: Request, res: Response): void;
    public abstract deleteHandler(req: Request, res: Response): void;
}
