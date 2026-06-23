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
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: createdUser.id, email: createdUser.email || email },
    include: { profile: true },
    omit: { password: true },
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
};
