import express, { Request, Response } from "express";

export class ApiError extends Error {
    private static mkTypes(types: ApiErrorType[]) {
        const map = new Map<number, ApiErrorType>();
        types.forEach(t => map.set(t.id, t));

        return map;
    }
    public static Types = ApiError.mkTypes([
        // basic
        { id: 404, code: 404, name: "not found" },

        // custom
        { id: 10000, name: "Invalid or missing jwt token", code: 403 },
        { id: 10001, name: "Destination invalid" },
        { id: 10002, name: "Code invalid" },
        { id: 10003, name: "Code in use", code: 409 },
        { id: 10004, name: "Code is reserved", code: 409 },
    ]);

    public static Handler(
        err: ApiError | Error,
        req: Request,
        res: Response,
        next: express.NextFunction
    ) {
        if (res.headersSent) return next(err);

        // console.error(err);

        const d: any = { error: true, message: err.message };

        if (err instanceof ApiError) {
            res.status(err.code);
            d.code = err.id;
        }

        res.json(d);
    }

    message: string;
    id: number;
    code: number;

    constructor(id: number) {
        super();

        const type = ApiError.Types.get(id);
        if (!type) throw new Error(`${id} is not a valid API error code`);

        this.message = type.name;
        this.id = id;
        this.code = type.code || 400;
    }
}
export default ApiError;

export interface ApiErrorType {
    name: string;
    id: number;
    code?: number;
}
