import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { allPosts } from "../posts/post.controller.js";



const router=Router()

router.get("/allpost" , isAuthenticated , isAuthorized("police") , allPosts)

export default router;
