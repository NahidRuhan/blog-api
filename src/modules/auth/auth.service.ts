import { prisma } from "../../lib/prisma";
import { LoginUserPayload } from "./auth.interface";
import bcrypt from "bcryptjs";

const loginUserIntoDB = async (payLoad: LoginUserPayload) => {
  const { email, password } = payLoad;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }
  return user;
};

export const authService = {
  loginUserIntoDB,
};
