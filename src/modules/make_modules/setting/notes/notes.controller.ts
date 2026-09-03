import httpStatus from "http-status";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { AuthRequest } from "../../../../middlewares/auth";
import { notesService } from "./notes.service";

const getNotes = catchAsync(async (req: AuthRequest, res) => {
  const result = await notesService.getDB(req?.user?._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notes retrieved successfully.",
    data: result,
  });
});

const updateNotes = catchAsync(async (req: AuthRequest, res) => {
  const result = await notesService.updateDB(req?.user?._id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notes saved successfully.",
    data: result,
  });
});

export const notesController = { getNotes, updateNotes };
