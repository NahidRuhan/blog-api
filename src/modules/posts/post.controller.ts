import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getAllPost = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

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