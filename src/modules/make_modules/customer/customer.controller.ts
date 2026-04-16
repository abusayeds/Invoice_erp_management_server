import httpStatus from "http-status";
import { AuthRequest } from "../../../middlewares/auth";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { customerService } from "./customer.service";

const customerCreate = catchAsync(async (req: AuthRequest, res) => {
  req.body.user_id = req?.user?._id;
  const result = await customerService.customerCreateDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer successfully.",
    data: result,
  });
});
const allCustomer = catchAsync(async (req: AuthRequest, res) => {
  const result = await customerService.allCustomerDB( req?.user?._id as string , req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All customer get successfully.",
    pagination : result.pagination ,
    data: result.allCustomer
  });
});
const singleCustomer = catchAsync(async (req: AuthRequest, res) => {
    const {id}  =  req.params
  const result = await customerService.singleCustomerDB( req?.user?._id as string , id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single customer get successfully.",
    data: result
  });
});
const deleteCustomer = catchAsync(async (req: AuthRequest, res) => {
  const result = await customerService.deleteCustomerDB( req?.user?._id as string , req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Oparation successfull.",
    data: result
  });
});
export const customerController = {
  customerCreate,
  allCustomer , 
  singleCustomer , 
  deleteCustomer
};
