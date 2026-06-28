import { prisma } from "../../lib/prisma"
import { ICreatePostPayLoad } from "./post.interface"

const getAllPostFromDB = async () => {

    const post = await prisma.post.findMany({
      include:{
        author:{
            omit: {
                password: true          
            }
        },
        comments:true,
      }
    })

    return post

}

const getPostByIdFromDB = async () => {
  
}

const getPostStatsFromDB = async () => {
  
}

const getMyPostsFromDB = async () => {
  
}

const createPostIntoDB = async (payLoad:ICreatePostPayLoad, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payLoad,
      authorId: userId
    }
  })
  return result
}

const updatePostIntoDB = async () => {
  
}

const deletePostFromDB = async () => {
  
}

export const postService = {
    getAllPostFromDB,
    getPostByIdFromDB,
    getPostStatsFromDB,
    getMyPostsFromDB,
    createPostIntoDB,
    updatePostIntoDB,
    deletePostFromDB
}
