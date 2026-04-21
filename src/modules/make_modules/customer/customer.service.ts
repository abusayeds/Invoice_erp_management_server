import queryBuilder from "../../../builder/queryBuilder";
import { TCustomer } from "./customer.interface";
import { CustomerModel } from "./customer.model";

const customerCreateDB = async (payload: TCustomer) => {
  const res = await CustomerModel.create(payload);
  return res;
};

const allCustomerDB = async (
  user_id: string,
  query: Record<string, unknown>,
) => {
  const customerQuery = new queryBuilder(
    CustomerModel.find({ user_id: user_id, active: true, archive : false , isDeleted: false }),
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
    .sort()
    .fields()
  const { totalData } = await customerQuery.paginate(
    CustomerModel.find({ user_id: user_id, active: true, archive : false , isDeleted: false }),
  );
  const allCustomer = await customerQuery.modelQuery.exec();
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = customerQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });

  return { allCustomer, pagination };
};

const singleCustomerDB = async (user_id: string , _id :string) => {
  const res = await CustomerModel.findOne({user_id , _id , active: true, archive : false , isDeleted: false});
  return res;
};
const deleteCustomerDB = async ( user_id : string , payload: TCustomer) => {
  const res = await CustomerModel.findOneAndUpdate({user_id , _id : payload._id} , payload , {new : true})
  return res;
};
export const customerService = {
  customerCreateDB,
  allCustomerDB,
  singleCustomerDB , 
  deleteCustomerDB
};
