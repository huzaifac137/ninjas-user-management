import { NextFunction, Request , Response } from "express"
export const isSeeder=async(req: Request , res: Response , next: NextFunction)=>{
    try {
        const {secret} = req.body;

        const seederSecret = "2dwiodjqwufgefgweygfyegfwio4389849edug47438";

        if(secret !== seederSecret){
             res.status(401).json({
                message : "Unauthorized: SEEDER_SECRET_MISMATCH"
            });
            return;
        }
        next();

    } catch (error) {
        res.status(500).json({
            message : "error : " + error
        });
    }
}