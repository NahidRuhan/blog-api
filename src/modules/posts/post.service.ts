import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
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

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("FaKE ERROR")

    const post = await tx.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: {
        where: {
          status : CommentStatus.APPROVED
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    },
  });

  return post

  });
  
  return transactionResult
};

const getPostStatsFromDB = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {

            const [
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViewsAggregate
            ] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVED
                    }
                }),
                await tx.comment.count(),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.APPROVED
                    }
                }),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.REJECT
                    }
                }),
                await tx.post.aggregate({
                    _sum: {
                        views: true
                    }
                })
            ]);


            return {
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews : totalPostViewsAggregate._sum.views
            }
        }
    );

    return transactionResult
}

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
    where: {
      id: postId,
    },
  });
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
