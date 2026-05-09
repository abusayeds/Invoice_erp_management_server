import { Request, Response } from "express";
import httpStatus from "http-status";
import { TeamMemberService } from "./teamMember.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthRequest } from "../../../middlewares/auth";
import { Email } from "../../basic_modules/user/sendEmail";
import { UserModel } from "../../basic_modules/user/user.model";
import { IUser } from "../../basic_modules/user/user.interface";
import { TeamMemberModel } from "./teamMember.model";
import AppError from "../../../errors/AppError";
 const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const inviteTeamMember = catchAsync(async (req: AuthRequest, res: Response) => {
  const owner_id = req.user?._id as string;

  const isTeamMember = await TeamMemberModel.findOne({ user_id: owner_id, status: "accepted" });
  if (isTeamMember) {
    throw new AppError(httpStatus.FORBIDDEN, "Only account owners can add team members.");
  }

  const result = await TeamMemberService.inviteTeamMember(owner_id, req.body);

  const memberData = {
    name :  result.name , 
    email :  result.email , 
    password :  "123456" ,
    subscriptionId :   req.user?.subscriptionId ,
    isVerify :  true ,
  }
  const user = await UserModel.create(memberData) as IUser;
  await TeamMemberModel.findByIdAndUpdate(result._id, { user_id: user._id });

 const emailHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    
    <h2 style="color: #333;"> You're Invited to Join Our Team!</h2>
    
    <p>Hello <strong>${result.name}</strong>,</p>
    
    <p>
      You have been invited to join our platform as a team member. Your account has been created successfully.
    </p>

    <h3 style="margin-top: 20px;">🔐Login Details:</h3>
    <ul>
      <li><strong>Email:</strong> ${result.email}</li>
      <li><strong>Password:</strong> 123456</li>
    </ul>

    <p style="color: red; font-size: 14px;">
      ⚠️ For security reasons, please change your password after your first login.
    </p>

    <p>
      Click the button below to login and get started:
    </p>

    <a href="${FRONTEND_URL}" 
       style="display: inline-block; margin-top: 15px; padding: 12px 25px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
       Login Now
    </a>

    <p style="margin-top: 30px;">
      If you have any questions, feel free to contact us.
    </p>

    <p>Best regards,<br/>Your Team 🚀</p>

  </div>
`;
  await Email( result.email as string, emailHtml);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Team member invited successfully",
    data: result,
  });
});

const getTeamMembers = catchAsync(async (req: AuthRequest, res: Response) => {
  const owner_id = req.user?._id as string;

  const isTeamMember = await TeamMemberModel.findOne({ user_id: owner_id, status: "accepted" });
  if (isTeamMember) {
    throw new AppError(httpStatus.FORBIDDEN, "Only account owners can view team members.");
  }

  const result = await TeamMemberService.getTeamMembers(owner_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Team members retrieved successfully",
    data: result,
  });
});

const updateTeamMember = catchAsync(async (req: AuthRequest, res: Response) => {
  const owner_id = req.user?._id as string;
  const memberId = req.params.id as string;

  const isTeamMember = await TeamMemberModel.findOne({ user_id: owner_id, status: "accepted" });
  if (isTeamMember) {
    throw new AppError(httpStatus.FORBIDDEN, "Only account owners can update team members.");
  }

  const result = await TeamMemberService.updateTeamMember(
    memberId,
    owner_id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Team member updated successfully",
    data: result,
  });
});

const deleteTeamMember = catchAsync(async (req: AuthRequest, res: Response) => {
  const owner_id = req.user?._id as string;
  const memberId = req.params.id;

  const isTeamMember = await TeamMemberModel.findOne({ user_id: owner_id, status: "accepted" });
  if (isTeamMember) {
    throw new AppError(httpStatus.FORBIDDEN, "Only account owners can delete team members.");
  }

  const result = await TeamMemberService.deleteTeamMember(memberId, owner_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Team member deleted successfully",
    data: result,
  });
});

export const TeamMemberController = {
  inviteTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
};
