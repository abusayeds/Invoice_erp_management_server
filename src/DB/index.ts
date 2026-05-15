import { UserModel } from "../modules/basic_modules/user/user.model";
import { PermissionModel } from "../modules/make_modules/permission/permission.model";
import { role } from "../utils/role";
import { ROLE_PERMISSIONS } from "../utils/permissions";

const superAdminData = {
  name: "Super Admin",
  email: "superadmin@gmail.com",
  password: "1qazxsw2", 
  role: role.superadmin,
  permissions: ROLE_PERMISSIONS.superadmin,
  isDeleted: false,
};

const companyData = {
  name: "Company",
  email: "company@gmail.com",
  password: "1qazxsw2", 
  phone: "1234567890",
  language: "en", 
  role: role.company,
  permissions: ROLE_PERMISSIONS.company,
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
    try {
    const roles = Object.values(role);
    for (const singleRole of roles) {
      const isExist = await PermissionModel.findOne({
        companyId: null,
        role: singleRole,
      });

      if (!isExist) {
        await PermissionModel.create({
          companyId: null,
          role: singleRole,
          permissions: [],
        });

        console.log(`Permission seeded for role: ${singleRole}`);
      }
    }
  } catch (error) {
    console.error("Permission seed error:", error);
  }

  await PermissionModel.findOneAndUpdate(
    { companyId: null, role: role.superadmin },
    { permissions: ROLE_PERMISSIONS.superadmin },
    { new: true, upsert: true }
  );
  await PermissionModel.findOneAndUpdate(
    { companyId: null, role: role.company },
    { permissions: ROLE_PERMISSIONS.company },
    { new: true, upsert: true }
  );
};

export default seedSuperAdmin;
