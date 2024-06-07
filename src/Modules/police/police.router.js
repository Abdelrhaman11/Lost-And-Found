import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { allPosts } from "../posts/post.controller.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import { updateLocationSchema } from "./police.validation.js";
import { updateLocation } from "./police.controller.js";



const router=Router()

router.get("/allpost" , isAuthenticated , isAuthorized("police") , allPosts)

router.post("/changelocation/:postId",isAuthenticated,isAuthorized("police") ,isValid(updateLocationSchema) ,updateLocation)


export default router;
