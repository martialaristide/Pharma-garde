import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

// FIX: Use aliased ExpressRequest and ExpressResponse to ensure correct types for middleware.
export const errorHandler = (err: Error, req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};