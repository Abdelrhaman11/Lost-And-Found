import joi from "joi";
import { isValidObjectId } from "../../Middleware/validation.middleware.js";


export const loginDarSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(8).max(16).required(),

}).required()

export const updateLocationSchema=joi.object({
    postId:joi.string().custom(isValidObjectId).required(),
    // location:joi.string().valid("Dar Alamal", "Dar ALHayat", "Wydad", "Nova Vita Rehabilitation Center" , "Dar Lamset Hanan El Shrouk").required()

}).required()