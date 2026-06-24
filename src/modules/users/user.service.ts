import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payLoad: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payLoad;

  const doesUserExist = await prisma.user.findUnique({ where: { email } });

  if (doesUserExist) {
    throw new Error("User already exists!");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: createdUser.id, email: createdUser.email || email },
    include: { profile: true },
    omit: { password: true },
  });

  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { profile: true },
    omit: { password: true },
  });
  return user;
};

const updateMyProfileIntoDB = async (userId: string, payLoad: any) => {
  const { name, email, profilePhoto, bio } = payLoad;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    include: { profile: true },
    omit: { password: true },
  });

  return updatedUser;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileIntoDB,
};
