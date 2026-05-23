import { UserModel } from "../modules/basic_modules/user/user.model";
import { PermissionModel } from "../modules/make_modules/permission/permission.model";
import { role } from "../utils/role";
import { permissions } from "../utils/rolePermission";

const superAdminData = {
  name: "Super Admin",
  email: "superadmin@gmail.com",
  password: "1qazxsw2", 
  role: role.superadmin,
  permissions: permissions,
  isDeleted: false,
};

const companyData = {
  name: "Company",
  email: "company@gmail.com",
  password: "1qazxsw2", 
  phone: "1234567890",
  language: "en", 
  role: role.company,
  permissions: permissions,
  isDeleted: false,
};

export const seedSuperAdmin = async () => {
  // Create or Update Super Admin User
  let superAdmin = await UserModel.findOne({ email: superAdminData.email });
  if (!superAdmin) {
    superAdmin = await UserModel.create(superAdminData);
  } else {
    superAdmin.permissions = superAdminData.permissions;
    await superAdmin.save();
  }

  let company = await UserModel.findOne({ email: companyData.email });
  if (!company) {
    company = await UserModel.create({ ...companyData, companyId: superAdmin._id });
  } else {
    company.permissions = companyData.permissions;
    await company.save();
  }
    

  await PermissionModel.findOneAndUpdate(
    { companyId: null, role: role.superadmin },
    { permissions: permissions },
    { new: true, upsert: true }
  );
  await PermissionModel.findOneAndUpdate(
    { companyId: null, role: role.company },
    { permissions: permissions },
    { new: true, upsert: true }
  );
};

export default seedSuperAdmin;
