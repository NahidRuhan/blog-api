import { catchAsync } from "../../utils/catchAsync";
import { premiumService } from "./premium.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";

const getPremiumContent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await premiumService.getPremiumContent(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Premium content fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const premiumController = {
  getPremiumContent,
};