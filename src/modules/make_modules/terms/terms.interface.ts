import { Document } from "mongoose";

export type TGetPaidFaster = {
  invoice: boolean;
  credit_note: boolean;
  payment: boolean;
  pos_balling: boolean;
  estimate: boolean;
};

export type TGetOrganized = {
  expense: boolean;
  time_tracking: boolean;
  customer_management: boolean;
  reporting: boolean;
  purchase_order: boolean;
  accounting: boolean;
};

export type TPlatforms = {
  mac: boolean;
  ios: boolean;
  android: boolean;
  windows: boolean;
  linux: boolean;
};

export type TIntegrations = {
  zapier: boolean;
  make: boolean;
  basecamp: boolean;
  all_integrations: boolean;
};

export type TByIndustry = {
  freelancers: boolean;
  contractors: boolean;
  photographers: boolean;
  consultants: boolean;
  graphic_designers: boolean;
  law_firms: boolean;
  marketing_agencies: boolean;
  non_profits: boolean;
  trucking_company: boolean;
};

export type TPaymentGateway = {
  stripe: boolean;
  paypal: boolean;
  square: boolean;
  razorpay: boolean;
  braintree: boolean;
  upi: boolean;
};

export type TDevelopers = {
  developers_api: boolean;
};

export type TFreeTools = {
  invoice_generator: boolean;
  estimate_generator: boolean;
  receipt_maker: boolean;
  po_generator: boolean;
  profit_margin_calculation: boolean;
  gst_calculator: boolean;
};

export type TFreeTemplates = {
  free_invoice_templates: boolean;
  free_estimate_templates: boolean;
  free_receipt_templates: boolean;
  free_po_templates: boolean;
};

export type TLearn = {
  blogs: boolean;
  comparison: boolean;
  newsLetter: boolean;
  customer_stories: boolean;
};

export type TContactUs = {
  contact: boolean;
  help_center: boolean;
};

export type TFeatures = {
  get_paid_faster: TGetPaidFaster;
  get_organized: TGetOrganized;
};

export type TSolutions = {
  platforms: TPlatforms;
  integrations: TIntegrations;
  by_industry: TByIndustry;
  payment_gateway: TPaymentGateway;
  developers: TDevelopers;
};

export type TResources = {
  free_templates: TFreeTemplates;
  learn: TLearn;
};

export type TTerms = {
  description: string;
  features: TFeatures;
  solutions: TSolutions;
  free_tools: TFreeTools;
  resources: TResources;
  contact_us: TContactUs;
};

export interface ITerms extends TTerms, Document {}
