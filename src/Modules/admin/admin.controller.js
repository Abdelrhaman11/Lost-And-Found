import { postModel } from "../../../DB/models/post.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../../utils/cloud.js";
import { reportModel } from "../../../DB/models/report.model.js";
import { userModel } from "../../../DB/models/user.model.js";

// Delete post
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await postModel.findById(req.params.postId);
  if (!post) return next(new Error("Post not found !"));

  const imagesArr = post.images;
  const ids = imagesArr.map((imageObj) => imageObj.id);

  //delete images
  const result = await cloudinary.api.delete_resources(ids);

  // delete folder
  await cloudinary.api.delete_folder(
    `${process.env.FOLDER_CLOUD_NAME}/posts/${post.cloudFolder}`
  );

  // Delete post from DB
  await postModel.findByIdAndDelete(req.params.postId);

  //send response
  return res.json({ success: true, message: "post deleted successfully" });
});

// ADD Police Account
export const addPolice = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const isUser = await userModel.findOne({ email });
  if (isUser)
    return next(new Error("Email already registerd !", { cause: 409 }));

  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );
  const user = await userModel.create({
    name:"police Station",
    email,
    password: hashPassword,
    locationPolice: "Police Station",
    role: "police",
    isConfirmed:true
  });
  return res.json({ success: true, results: user });
});


// ADD Dar Account
export const addDar = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  const isUser = await userModel.findOne({ email });
  if (isUser)
    return next(new Error("Email already reqistered !"), { cause: 409 });

  const checkName = await userModel.findOne({ name });
  if (checkName)
    return next(new Error("name already reqistered !"), { cause: 409 });

  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );

  const user = await userModel.create({
    email,
    password: hashPassword,
    name,
    role: "dar",
    isConfirmed: true,
  });
  return res.json({ success: true, results: user });
});

// All reports
export const allReport = asyncHandler(async (req, res, next) => {
  const getReports = await reportModel.find();
  return res.json({ success: true, Reports: getReports });
});

// Single reports
export const singleReport = asyncHandler(async (req, res, next) => {
  const { reportId } = req.params;
  const report = await reportModel.findById(reportId);
  if (!report) return next(new Error("Report not found !"));

  res.json({ success: true, results: report });
});
