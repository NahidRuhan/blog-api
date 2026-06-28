import { prisma } from "../../lib/prisma";
import { ICreatePostPayLoad, IUpdatePostPayLoad } from "./post.interface";

const getAllPostFromDB = async () => {
  const post = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return post;
};

const getPostByIdFromDB = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost;
};

const getPostStatsFromDB = async () => {};

const getMyPostsFromDB = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const createPostIntoDB = async (
  payLoad: ICreatePostPayLoad,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...payLoad,
      authorId: userId,
    },
  });
  return result;
};

const updatePostIntoDB = async (
  postId: string,
  payLoad: IUpdatePostPayLoad,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post?.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payLoad,
  });

  return result;
};

const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post?.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }
  await prisma.post.delete({
    where:{
      id:postId
    }
  })

};

export const postService = {
  getAllPostFromDB,
  getPostByIdFromDB,
  getPostStatsFromDB,
  getMyPostsFromDB,
  createPostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
};
