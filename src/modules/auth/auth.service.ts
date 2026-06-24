import config from "../../config";
import { prisma } from "../../lib/prisma";
import { LoginUserPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const loginUserIntoDB = async (payLoad: LoginUserPayload) => {
  const { email, password } = payLoad;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  if (user.activeStatus === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );
  
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUserIntoDB,
};
