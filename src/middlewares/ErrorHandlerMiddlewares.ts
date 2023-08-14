import { NextFunction, Request, Response } from 'express';
import { BaseError } from '../errors/BaseError';

export function errorHandlerMiddleware(err: BaseError, req: Request, res: Response, next: NextFunction): void {
    console.error(err); // Log the error for debugging purposes

    const statusCode = err.code || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: message });
}
