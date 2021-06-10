import chalk from "chalk";
import rateLimit, { Options as rlOptions } from "express-rate-limit";
import ApiError from "./ApiError";

const def: rlOptions = {
    // reset time
    windowMs: 15 * 60 * 1000, // 15min

    // return an apierror on ratelimit
    handler: (req, res, next) => next(new ApiError(429)),

    // log the ratelimit
    onLimitReached: (req, res, opts) => {
        console.log(
            chalk.yellow`${req.ip} got rate limited after sending ${
                req.rateLimit.current
            } requsets in ${
                opts.windowMs && `${Math.round(opts.windowMs / 1000)} seconds`
            }`
        );
    },
};

export const defaultRL = rateLimit({
    ...def,
    windowMs: 15 * 60 * 1000,
    max: 69,
});

export const createRL = rateLimit({
    ...def,
    windowMs: 15 * 60 * 1000,
    max: 10,
});
