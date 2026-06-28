import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";

const getAllPost = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

    const result = await postService.getAllPostFromDB()

    sendResponse(res,{
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts fetched successfully",
      data: result
    })

})

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    const id = req.user?.id
    const payload = req.body
    const result = await postService.createPostIntoDB(payload, id as string)

    sendResponse(res,{
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result
    })

})

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

export const postController = {
  getAllPost,
  getPostById,
  getPostStats,
  getMyPosts,
  createPost,
  updatePost,
  deletePost
}