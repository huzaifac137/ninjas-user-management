import {rateLimit} from "express-rate-limit";

export const rateLimiter=()=>{
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500, 
        message: {message : "Too many requests, please try again later."}
     })
}