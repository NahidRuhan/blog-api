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
  const postId = req.params.postId

  if(!postId){
    throw new Error('PostId is required params')
  }

  const result = await postService.getPostByIdFromDB(postId as string)

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Post fetched successfully",
    data:result
  })

})

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const authorId = req.user?.id as string

  if(!authorId){
    throw new Error('User not found')
  }

  const result = await postService.getMyPostsFromDB(authorId)

  sendResponse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "My posts fetched successfully",
    data: result
  })

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

  const authorId = req.user?.id as string
  const isAdmin = req.user?.role === "ADMIN"
  const postId = req.params.postId as string
  const payload = req.body

  if(!postId){
    throw new Error('PostId is required params')
  }

  const result = await postService.updatePostIntoDB(postId, payload,authorId,isAdmin)

  sendResponse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: result
  })

})

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const isAdmin = req.user?.role === "ADMIN"
  const postId = req.params.postId as string
  const authorId = req.user?.id as string

  if(!postId){
    throw new Error('PostId is required params')
  }

  await postService.deletePostFromDB(postId,authorId,isAdmin)

  sendResponse(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: null
  })
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