import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { creatorId } from "../../account/account.utils";
import { balanceSheetService } from "./balanceSheet.service";

const list = catchAsync(async (req: AuthRequest, res) => {
  const result = await balanceSheetService.getAllDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Balance sheets retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const latest = catchAsync(async (req: AuthRequest, res) => {
  const latest = await balanceSheetService.getLatestDB(req.user!._id as string);
  const data = latest
    ? await balanceSheetService.getFormattedSingleDB(latest._id!.toString(), req.user!._id as string)
    : null;
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: data ? "Latest balance sheet found" : "No balance sheets yet",
    data,
  });
});

const create = catchAsync(async (req: AuthRequest, res) => {
  const sheet = await balanceSheetService.generateBalanceSheetDB(
    req.user!._id as string,
    creatorId(req),
    new Date(req.body.balance_sheet_date),
    req.body.financial_year
  );
  const data = await balanceSheetService.getFormattedSingleDB(
    sheet._id!.toString(),
    req.user!._id as string
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Balance sheet generated successfully",
    data,
  });
});

const show = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.getFormattedSingleDB(
    req.params.id,
    req.user!._id as string
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Balance sheet retrieved successfully",
    data,
  });
});

const print = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.getFormattedSingleDB(
    req.params.id,
    req.user!._id as string
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Balance sheet print data",
    data: { ...data, print: true },
  });
});

const finalize = catchAsync(async (req: AuthRequest, res) => {
  await balanceSheetService.finalizeDB(req.params.id, req.user!._id as string);
  const data = await balanceSheetService.getFormattedSingleDB(
    req.params.id,
    req.user!._id as string
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Balance sheet finalized successfully",
    data,
  });
});

const remove = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.deleteDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Balance sheet deleted successfully",
    data,
  });
});

const addNote = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.addNoteDB(
    req.params.id,
    req.user!._id as string,
    req,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Note added successfully",
    data,
  });
});

const deleteNote = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.deleteNoteDB(
    req.params.balanceSheetId,
    req.params.noteId,
    req.user!._id as string
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note deleted successfully",
    data,
  });
});

const compare = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.compareDB(
    req.user!._id as string,
    creatorId(req),
    req.body.current_period_id,
    req.body.previous_period_id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comparison created successfully",
    data,
  });
});

const comparisons = catchAsync(async (req: AuthRequest, res) => {
  const result = await balanceSheetService.listComparisonsDB(req.user!._id as string, req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comparisons retrieved successfully",
    data: result.rows,
    pagination: result.pagination,
  });
});

const showComparison = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.getComparisonDB(req.params.id, req.user!._id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comparison retrieved successfully",
    data,
  });
});

const comparisonPrint = catchAsync(async (req: AuthRequest, res) => {
  const { current_id, previous_id } = req.query;
  const data = await balanceSheetService.comparisonPrintDB(
    req.user!._id as string,
    String(current_id),
    String(previous_id)
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comparison print data",
    data: { ...data, print: true },
  });
});

const yearEndClose = catchAsync(async (req: AuthRequest, res) => {
  const data = await balanceSheetService.yearEndCloseDB(
    req.user!._id as string,
    creatorId(req),
    req.body.financial_year,
    new Date(req.body.closing_date)
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Year-end closing completed successfully",
    data,
  });
});

export const balanceSheetController = {
  list,
  latest,
  create,
  show,
  print,
  finalize,
  remove,
  addNote,
  deleteNote,
  compare,
  comparisons,
  showComparison,
  comparisonPrint,
  yearEndClose,
};
