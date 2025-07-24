import rateLimit from 'express-rate-limit';

export const generalRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: "Too many requests from this IP, please try again after a minute."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
