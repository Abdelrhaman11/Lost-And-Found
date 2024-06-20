import { Router } from "express";
import { isAuthenticated } from "../../Middleware/authentication.middleware.js";
import { isAuthorized } from "../../Middleware/authorizaion.middleware.js";
import { matchImage } from "./match.controller.js";

const router =Router();

router.post("/matchImage" , isAuthenticated , isAuthorized("user") , matchImage)



export default router;
