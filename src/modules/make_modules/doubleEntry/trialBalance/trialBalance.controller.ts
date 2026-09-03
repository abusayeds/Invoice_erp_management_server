import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { generateTrialBalance } from "./trialBalance.service";

const index = catchAsync(async (req: AuthRequest, res) => {
  const data = await generateTrialBalance(
    req.user!._id as string,
    req.query.from_date as string | undefined,
    req.query.to_date as string | undefined
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Trial balance generated successfully",
    data,
  });
});

const print = catchAsync(async (req: AuthRequest, res) => {
  const data = await generateTrialBalance(
    req.user!._id as string,
    req.query.from_date as string | undefined,
    req.query.to_date as string | undefined
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Trial balance print data",
    data: { ...data, print: true },
  });
});

export const trialBalanceController = { index, print };
