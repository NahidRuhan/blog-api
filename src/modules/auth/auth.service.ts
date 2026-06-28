import config from "../../config";
import { prisma } from "../../lib/prisma";
import { LoginUserPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";

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

const refreshToken = async (token:string) => {
const verifyRefreshToken = jwtUtils.verifyToken(
  token, 
  config.jwt_refresh_secret
)
if(!verifyRefreshToken.success){
  throw new Error("Invalid refresh token");
}
const {id} = verifyRefreshToken.data as JwtPayload

const user = await prisma.user.findUniqueOrThrow({
  where:{
    id:id
  }
})

if(user.activeStatus === "BLOCKED"){
  throw new Error("Your account has been blocked. Please contact support.");
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

return {
  accessToken,
};

}

export const authService = {
  loginUserIntoDB,
  refreshToken
};
