export const role = {
    admin: "admin",
    company: "company",
    client : "client" ,
    staff : "staff" ,
    vendor :  "vandor" , 
    hr :  "hr"
} as const;

export type TRole = keyof typeof role