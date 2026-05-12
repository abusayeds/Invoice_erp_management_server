export const role = {
    superadmin: "superadmin",
    company: "company",
    client : "client" ,
    staff : "staff" ,
    vendor :  "vendor" , 
    hr :  "hr"
} as const;

export type TRole = keyof typeof role