import { Router } from "express";
import {  updateLocationSchema } from "./dar.validation.js";
import { updateLocation,  allPosrInDar } from "./dar.controller.js";
import { isValid } from "../../Middleware/validation.middleware.js";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { allPosts } from "../posts/post.controller.js";


const router=Router()


router.post("/changelocation/:postId",isAuthenticated,isAuthorized("dar") ,isValid(updateLocationSchema) ,updateLocation)
router.get("/allpostindar" , isAuthenticated , isAuthorized("dar") , allPosrInDar)
router.get("/allpost" , isAuthenticated , isAuthorized("dar") , allPosts)



export default router