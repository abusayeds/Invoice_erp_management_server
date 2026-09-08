import httpStatus from "http-status";
import { AuthRequest } from "../../../../middlewares/auth";
import catchAsync from "../../../../utils/catchAsync";
import sendResponse from "../../../../utils/sendResponse";
import { ChartOfAccountModel } from "../../account/chartOfAccount/chartOfAccount.model";
import { companyScope } from "../../account/account.utils";
import { getAllLedgerEntries, getLedgerEntriesForPrint } from "./ledgerSummary.service";

const index = catchAsync(async (req: AuthRequest, res) => {
  const userId = req.user!._id as string;
  const [result, accounts] = await Promise.all([
    getAllLedgerEntries(userId, req.query as Record<string, unknown>),
    ChartOfAccountModel.find({ ...companyScope(userId), is_active: true })
      .select("_id account_code account_name")
      .sort({ account_code: 1 })
      .lean(),
  ]);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ledger summary retrieved successfully",
    data: { entries: result.rows, accounts },
    pagination: result.pagination,
  });
});

const print = catchAsync(async (req: AuthRequest, res) => {
  const userId = req.user!._id as string;
  const entries = await getLedgerEntriesForPrint(
    userId,
    req.query.from_date as string | undefined,
    req.query.to_date as string | undefined,
    req.query.account_id as string | undefined
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Ledger summary print data",
    data: {
      entries,
      filters: {
        from_date: req.query.from_date,
        to_date: req.query.to_date,
        account_id: req.query.account_id,
      },
      print: true,
    },
  });
});

export const ledgerSummaryController = { index, print };
