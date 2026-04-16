import queryBuilder from "../../../builder/queryBuilder";
import { TVendor } from "./vendor.interface";
import { VendorModel } from "./vendor.model";


const vendorCreateDB = async (payload: TVendor) => {
  const res = await VendorModel.create(payload);
  return res;
};

const allVendorDB = async (
  user_id: string,
  query: Record<string, unknown>,
) => {
  const vendorQuery = new queryBuilder(
    VendorModel.find({ user_id: user_id, active: true, archive : false , isDeleted: false }),
    query,
  )
    .search([
      "companyName",
      "firstName",
      "lastName",
      "lastName",
      "BusinessPhone",
      "fax",
      "bank_details",
      "currency",
      "tax_service",
      "tax_product",
    ])
    .filter()
    .sort();
  const { totalData } = await vendorQuery.paginate(
    VendorModel.find({ user_id: user_id, active: true, archive : false , isDeleted: false }),
  );
  const allVendor = await vendorQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = vendorQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });

  return { allVendor, pagination };
};

const singleVendorDB = async (user_id: string , _id :string) => {
  const res = await VendorModel.findOne({user_id , _id , active: true, archive : false , isDeleted: false});
  return res;
};
const deleteVendorDB = async ( user_id : string , payload: TVendor) => {
  const res = await VendorModel.findOneAndUpdate({user_id , _id : payload._id} , payload , {new : true})
  return res;
};
export const vendorService = {
  vendorCreateDB,
  allVendorDB,
  singleVendorDB , 
  deleteVendorDB
};
