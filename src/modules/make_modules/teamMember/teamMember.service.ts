import httpStatus from "http-status";
import { TeamMemberModel } from "./teamMember.model";
import { ITeamMember } from "./teamMember.interface";
import { sendEmail } from "../../basic_modules/user/sendEmail";
import AppError from "../../../errors/AppError";

// Assuming you have a base URL for your frontend


const inviteTeamMember = async (owner_id: string, payload: Partial<ITeamMember>) => {
  const existingMember = await TeamMemberModel.findOne({ email: payload.email, owner_id });
  if (existingMember) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already invited to your team");
  }
  const teamMember = await TeamMemberModel.create({
    ...payload,
    owner_id,
  });
  return teamMember;
};
const getTeamMembers = async (owner_id: string) => {
  const teamMembers = await TeamMemberModel.find({ owner_id }).populate('user_id', 'name email image');
  return teamMembers;
};
const updateTeamMember = async (id: string, owner_id: string, payload: Partial<ITeamMember>) => {
  const teamMember = await TeamMemberModel.findOneAndUpdate(
    { _id: id, owner_id },
    payload,
    { new: true, runValidators: true }
  );
  if (!teamMember) {
    throw new AppError(httpStatus.NOT_FOUND, "Team member not found");
  }
  return teamMember;
};

const deleteTeamMember = async (id: string, owner_id: string) => {
  const teamMember = await TeamMemberModel.findOneAndDelete({ _id: id, owner_id });
  if (!teamMember) {
    throw new AppError(httpStatus.NOT_FOUND, "Team member not found");
  }
  return teamMember;
};

export const TeamMemberService = {
  inviteTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
};
