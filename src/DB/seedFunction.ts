import mongoose from "mongoose";
import { UserModel } from "../modules/basic_modules/user/user.model";
import { role } from "../utils/role";

const COMPANY_ID = new mongoose.Types.ObjectId(
  "6ac09a014955ebcf924b0866"
);


const additionalUsers = [
  // =========================================
  // CUSTOMERS - 10
  // =========================================

  {
    name: "Mahfuz Customer",
    email: "mahfuzcustomer@gmail.com",
    phone: "+8801912000001",
    designation: "Managing Director",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Gulshan, Dhaka",
    website: "https://example.com",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Mahfuz Trading Limited",
      registration_number: "TRD-DHK-30001",
      tax_number: "TIN-3000001",
      business_phone: "+8801912000001",
      payment_terms: "Net 30",
      opening_balance: 28500,
      payment_reminder: true,
      is_login_required: false,

      billing_address: {
        name: "Mahfuz Trading Limited",
        address_line_1: "House 18, Road 24",
        address_line_2: "Gulshan-1",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1212",
      },

      shipping_address: {
        name: "Mahfuz Trading Limited",
        address_line_1: "House 18, Road 24",
        address_line_2: "Gulshan-1",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1212",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Anik Customer",
    email: "anikcustomer@gmail.com",
    phone: "+8801912000002",
    designation: "Director",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Bashundhara, Dhaka",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Anik Consumer Goods",
      registration_number: "TRD-DHK-30002",
      tax_number: "TIN-3000002",
      business_phone: "+8801912000002",
      payment_terms: "Net 15",
      opening_balance: 19500,
      payment_reminder: true,

      billing_address: {
        name: "Anik Consumer Goods",
        address_line_1: "Block C, Road 8",
        address_line_2: "Bashundhara R/A",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1229",
      },

      shipping_address: {
        name: "Anik Consumer Goods",
        address_line_1: "Block C, Road 8",
        address_line_2: "Bashundhara R/A",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1229",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Mehedi Customer",
    email: "mehedicustomer@gmail.com",
    phone: "+8801912000003",
    designation: "Business Owner",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Mirpur, Dhaka",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Mehedi Business Solutions",
      registration_number: "TRD-DHK-30003",
      tax_number: "TIN-3000003",
      business_phone: "+8801912000003",
      payment_terms: "Net 30",
      opening_balance: 22000,
      payment_reminder: false,

      billing_address: {
        name: "Mehedi Business Solutions",
        address_line_1: "House 22, Road 6",
        address_line_2: "Mirpur-2",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1216",
      },

      shipping_address: {
        name: "Mehedi Business Solutions",
        address_line_1: "House 22, Road 6",
        address_line_2: "Mirpur-2",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1216",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Nabil Customer",
    email: "nabilcustomer@gmail.com",
    phone: "+8801912000004",
    designation: "Chief Executive Officer",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Banani, Dhaka",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Nabil Digital Commerce",
      registration_number: "TRD-DHK-30004",
      tax_number: "TIN-3000004",
      business_phone: "+8801912000004",
      payment_terms: "Net 30",
      opening_balance: 34000,
      payment_reminder: true,

      billing_address: {
        name: "Nabil Digital Commerce",
        address_line_1: "Road 11, House 15",
        address_line_2: "Banani",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1213",
      },

      shipping_address: {
        name: "Nabil Digital Commerce",
        address_line_1: "Road 11, House 15",
        address_line_2: "Banani",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1213",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Adnan Customer",
    email: "adnancustomer@gmail.com",
    phone: "+8801912000005",
    designation: "Proprietor",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Dhanmondi, Dhaka",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Adnan Lifestyle Mart",
      registration_number: "TRD-DHK-30005",
      tax_number: "TIN-3000005",
      business_phone: "+8801912000005",
      payment_terms: "Net 15",
      opening_balance: 16500,
      payment_reminder: true,

      billing_address: {
        name: "Adnan Lifestyle Mart",
        address_line_1: "Road 7, House 31",
        address_line_2: "Dhanmondi",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1209",
      },

      shipping_address: {
        name: "Adnan Lifestyle Mart",
        address_line_1: "Road 7, House 31",
        address_line_2: "Dhanmondi",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1209",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Fardin Customer",
    email: "fardincustomer@gmail.com",
    phone: "+8801912000006",
    designation: "Managing Partner",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Agrabad, Chattogram",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Fardin Commercial House",
      registration_number: "TRD-CTG-30006",
      tax_number: "TIN-3000006",
      business_phone: "+8801912000006",
      payment_terms: "Net 30",
      opening_balance: 29500,
      payment_reminder: true,

      billing_address: {
        name: "Fardin Commercial House",
        address_line_1: "CDA Avenue",
        address_line_2: "Agrabad",
        city: "Chattogram",
        state: "Chattogram",
        country: "Bangladesh",
        zip_code: "4100",
      },

      shipping_address: {
        name: "Fardin Commercial House",
        address_line_1: "CDA Avenue",
        address_line_2: "Agrabad",
        city: "Chattogram",
        state: "Chattogram",
        country: "Bangladesh",
        zip_code: "4100",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Arafat Customer",
    email: "arafatcustomer@gmail.com",
    phone: "+8801912000007",
    designation: "Director",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Khulshi, Chattogram",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Arafat Industrial Supplies",
      registration_number: "TRD-CTG-30007",
      tax_number: "TIN-3000007",
      business_phone: "+8801912000007",
      payment_terms: "Net 30",
      opening_balance: 41000,
      payment_reminder: true,

      billing_address: {
        name: "Arafat Industrial Supplies",
        address_line_1: "Khulshi Commercial Area",
        city: "Chattogram",
        state: "Chattogram",
        country: "Bangladesh",
        zip_code: "4225",
      },

      shipping_address: {
        name: "Arafat Industrial Supplies",
        address_line_1: "Khulshi Commercial Area",
        city: "Chattogram",
        state: "Chattogram",
        country: "Bangladesh",
        zip_code: "4225",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Saif Customer",
    email: "saifcustomer@gmail.com",
    phone: "+8801912000008",
    designation: "Founder",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Narayanganj",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Saif Textile Trading",
      registration_number: "TRD-NAR-30008",
      tax_number: "TIN-3000008",
      business_phone: "+8801912000008",
      payment_terms: "Net 30",
      opening_balance: 36500,
      payment_reminder: true,

      billing_address: {
        name: "Saif Textile Trading",
        address_line_1: "B.B. Road",
        city: "Narayanganj",
        state: "Narayanganj",
        country: "Bangladesh",
        zip_code: "1400",
      },

      shipping_address: {
        name: "Saif Textile Trading",
        address_line_1: "B.B. Road",
        city: "Narayanganj",
        state: "Narayanganj",
        country: "Bangladesh",
        zip_code: "1400",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Zubair Customer",
    email: "zubaircustomer@gmail.com",
    phone: "+8801912000009",
    designation: "General Manager",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Rajshahi",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Zubair Agro Traders",
      registration_number: "TRD-RAJ-30009",
      tax_number: "TIN-3000009",
      business_phone: "+8801912000009",
      payment_terms: "Net 15",
      opening_balance: 23500,
      payment_reminder: false,

      billing_address: {
        name: "Zubair Agro Traders",
        address_line_1: "Shaheb Bazar Road",
        city: "Rajshahi",
        state: "Rajshahi",
        country: "Bangladesh",
        zip_code: "6000",
      },

      shipping_address: {
        name: "Zubair Agro Traders",
        address_line_1: "Shaheb Bazar Road",
        city: "Rajshahi",
        state: "Rajshahi",
        country: "Bangladesh",
        zip_code: "6000",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Rashed Customer",
    email: "rashedcustomer@gmail.com",
    phone: "+8801912000010",
    designation: "Business Owner",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Sylhet",
    role: role.customer,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Rashed Foods & Distribution",
      registration_number: "TRD-SYL-30010",
      tax_number: "TIN-3000010",
      business_phone: "+8801912000010",
      payment_terms: "Net 30",
      opening_balance: 27500,
      payment_reminder: true,

      billing_address: {
        name: "Rashed Foods & Distribution",
        address_line_1: "Ambarkhana",
        city: "Sylhet",
        state: "Sylhet",
        country: "Bangladesh",
        zip_code: "3100",
      },

      shipping_address: {
        name: "Rashed Foods & Distribution",
        address_line_1: "Ambarkhana",
        city: "Sylhet",
        state: "Sylhet",
        country: "Bangladesh",
        zip_code: "3100",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  // =========================================
  // VENDORS - 10
  // =========================================

  {
    name: "Mahmud Vendor",
    email: "mahmudvendor@gmail.com",
    phone: "+8801813000001",
    designation: "Supplier",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Tejgaon, Dhaka",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Mahmud Industrial Supply",
      registration_number: "VEN-DHK-40001",
      tax_number: "VTIN-4000001",
      business_phone: "+8801813000001",
      payment_terms: "Net 30",
      opening_balance: 52000,
      payment_reminder: true,

      billing_address: {
        name: "Mahmud Industrial Supply",
        address_line_1: "Tejgaon Industrial Area",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1208",
      },

      shipping_address: {
        name: "Mahmud Industrial Supply",
        address_line_1: "Tejgaon Industrial Area",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1208",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Noman Vendor",
    email: "nomanvendor@gmail.com",
    phone: "+8801813000002",
    designation: "Distributor",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Kawran Bazar, Dhaka",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Noman Distribution House",
      registration_number: "VEN-DHK-40002",
      tax_number: "VTIN-4000002",
      business_phone: "+8801813000002",
      payment_terms: "Net 15",
      opening_balance: 34500,
      payment_reminder: true,

      billing_address: {
        name: "Noman Distribution House",
        address_line_1: "Kawran Bazar",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1215",
      },

      shipping_address: {
        name: "Noman Distribution House",
        address_line_1: "Kawran Bazar",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1215",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Mizan Vendor",
    email: "mizanvendor@gmail.com",
    phone: "+8801813000003",
    designation: "Manufacturer",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Gazipur",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Mizan Garments Supply",
      registration_number: "VEN-GAZ-40003",
      tax_number: "VTIN-4000003",
      business_phone: "+8801813000003",
      payment_terms: "Net 30",
      opening_balance: 63000,
      payment_reminder: true,

      billing_address: {
        name: "Mizan Garments Supply",
        address_line_1: "Konabari Industrial Area",
        city: "Gazipur",
        state: "Gazipur",
        country: "Bangladesh",
        zip_code: "1346",
      },

      shipping_address: {
        name: "Mizan Garments Supply",
        address_line_1: "Konabari Industrial Area",
        city: "Gazipur",
        state: "Gazipur",
        country: "Bangladesh",
        zip_code: "1346",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Ovi Vendor",
    email: "ovivendor@gmail.com",
    phone: "+8801813000004",
    designation: "Supplier",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Nawabpur, Dhaka",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Ovi Hardware Supply",
      registration_number: "VEN-DHK-40004",
      tax_number: "VTIN-4000004",
      business_phone: "+8801813000004",
      payment_terms: "Net 30",
      opening_balance: 29500,
      payment_reminder: false,

      billing_address: {
        name: "Ovi Hardware Supply",
        address_line_1: "Nawabpur Road",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1100",
      },

      shipping_address: {
        name: "Ovi Hardware Supply",
        address_line_1: "Nawabpur Road",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zip_code: "1100",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Siam Vendor",
    email: "siamvendor@gmail.com",
    phone: "+8801813000005",
    designation: "Supplier",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Jashore",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Siam Agro Supply",
      registration_number: "VEN-JES-40005",
      tax_number: "VTIN-4000005",
      business_phone: "+8801813000005",
      payment_terms: "Net 15",
      opening_balance: 38500,
      payment_reminder: true,

      billing_address: {
        name: "Siam Agro Supply",
        address_line_1: "M.K. Road",
        city: "Jashore",
        state: "Khulna",
        country: "Bangladesh",
        zip_code: "7400",
      },

      shipping_address: {
        name: "Siam Agro Supply",
        address_line_1: "M.K. Road",
        city: "Jashore",
        state: "Khulna",
        country: "Bangladesh",
        zip_code: "7400",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Foysal Vendor",
    email: "foysalvendor@gmail.com",
    phone: "+8801813000006",
    designation: "Distributor",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Rangpur",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Foysal Distribution Network",
      registration_number: "VEN-RAN-40006",
      tax_number: "VTIN-4000006",
      business_phone: "+8801813000006",
      payment_terms: "Net 30",
      opening_balance: 44500,
      payment_reminder: true,

      billing_address: {
        name: "Foysal Distribution Network",
        address_line_1: "Station Road",
        city: "Rangpur",
        state: "Rangpur",
        country: "Bangladesh",
        zip_code: "5400",
      },

      shipping_address: {
        name: "Foysal Distribution Network",
        address_line_1: "Station Road",
        city: "Rangpur",
        state: "Rangpur",
        country: "Bangladesh",
        zip_code: "5400",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Tamim Vendor",
    email: "tamimvendor@gmail.com",
    phone: "+8801813000007",
    designation: "Supplier",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Mymensingh",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Tamim Food Supply",
      registration_number: "VEN-MYM-40007",
      tax_number: "VTIN-4000007",
      business_phone: "+8801813000007",
      payment_terms: "Net 15",
      opening_balance: 27000,
      payment_reminder: true,

      billing_address: {
        name: "Tamim Food Supply",
        address_line_1: "Ganginarpar Road",
        city: "Mymensingh",
        state: "Mymensingh",
        country: "Bangladesh",
        zip_code: "2200",
      },

      shipping_address: {
        name: "Tamim Food Supply",
        address_line_1: "Ganginarpar Road",
        city: "Mymensingh",
        state: "Mymensingh",
        country: "Bangladesh",
        zip_code: "2200",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Jony Vendor",
    email: "jonyvendor@gmail.com",
    phone: "+8801813000008",
    designation: "Manufacturer",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Narayanganj",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Jony Packaging Industries",
      registration_number: "VEN-NAR-40008",
      tax_number: "VTIN-4000008",
      business_phone: "+8801813000008",
      payment_terms: "Net 30",
      opening_balance: 58000,
      payment_reminder: true,

      billing_address: {
        name: "Jony Packaging Industries",
        address_line_1: "Fatullah Industrial Area",
        city: "Narayanganj",
        state: "Narayanganj",
        country: "Bangladesh",
        zip_code: "1400",
      },

      shipping_address: {
        name: "Jony Packaging Industries",
        address_line_1: "Fatullah Industrial Area",
        city: "Narayanganj",
        state: "Narayanganj",
        country: "Bangladesh",
        zip_code: "1400",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Asif Vendor",
    email: "asifvendor@gmail.com",
    phone: "+8801813000009",
    designation: "Supplier",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Bogura",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Asif Engineering Supply",
      registration_number: "VEN-BOG-40009",
      tax_number: "VTIN-4000009",
      business_phone: "+8801813000009",
      payment_terms: "Net 30",
      opening_balance: 32500,
      payment_reminder: false,

      billing_address: {
        name: "Asif Engineering Supply",
        address_line_1: "Sherpur Road",
        city: "Bogura",
        state: "Rajshahi",
        country: "Bangladesh",
        zip_code: "5800",
      },

      shipping_address: {
        name: "Asif Engineering Supply",
        address_line_1: "Sherpur Road",
        city: "Bogura",
        state: "Rajshahi",
        country: "Bangladesh",
        zip_code: "5800",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },

  {
    name: "Nafis Vendor",
    email: "nafisvendor@gmail.com",
    phone: "+8801813000010",
    designation: "Managing Partner",
    language: "English",
    currency: "BDT",
    country: "Bangladesh",
    address: "Khulna",
    role: role.vendor,
    companyId: COMPANY_ID,

    businessProfile: {
      companyName: "Nafis Logistics & Supply",
      registration_number: "VEN-KHU-40010",
      tax_number: "VTIN-4000010",
      business_phone: "+8801813000010",
      payment_terms: "Net 30",
      opening_balance: 49000,
      payment_reminder: true,

      billing_address: {
        name: "Nafis Logistics & Supply",
        address_line_1: "Khalishpur Industrial Area",
        city: "Khulna",
        state: "Khulna",
        country: "Bangladesh",
        zip_code: "9000",
      },

      shipping_address: {
        name: "Nafis Logistics & Supply",
        address_line_1: "Khalishpur Industrial Area",
        city: "Khulna",
        state: "Khulna",
        country: "Bangladesh",
        zip_code: "9000",
      },

      same_as_billing: true,
      active: true,
      isArchive: false,
    },
  },
];
const seedUsers = async () => {
  try {
    let inserted = 0;
    let existing = 0;

    for (const user of additionalUsers) {
      const result = await UserModel.updateOne(
        { email: user.email },
        {
          $setOnInsert: user,
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else {
        existing++;
      }
    }

    console.log(
      `User seed completed: ${inserted} inserted, ${existing} already existed`
    );
  } catch (error) {
    console.error("User seed failed:", error);
  }
};

export default seedUsers;