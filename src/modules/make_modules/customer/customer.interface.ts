import { Types } from "mongoose"

export type TAddress = {
  street: string;
  zip: string;
  city: string;
  state: string;
  country: string;
};
export type TCustomerSettings =  {
      currency  : string, 
      tax_service : string ,
      tax_product : string ,
      payment_terms_seles : string
      opening_balance : number 
      notes : string
}
export type TCustomer = { 
    _id ? : Types.ObjectId , 
    companyName  : string , 
    email : string , 
    reg_no : string , 
    tax_id : string
    firstName : string ,
    lastName : string , 
    BusinessPhone : string ,
    fax :  string , 
    mobile : string ,  
    home_phone :  string
    adress : TAddress
    billingAddress : TAddress
    bank_details : string
    customer_settings : TCustomerSettings
    payment_reminder : {
        custormer :  boolean , 
        vendor : boolean  , 
    }
}