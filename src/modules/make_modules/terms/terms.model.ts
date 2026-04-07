import { Schema, model } from "mongoose";
import {
  ITerms,
  TFeatures,
  TSolutions,
  TResources,
  TGetPaidFaster,
  TGetOrganized,
  TPlatforms,
  TIntegrations,
  TByIndustry,
  TPaymentGateway,
  TDevelopers,
  TFreeTools,
  TFreeTemplates,
  TLearn,
  TContactUs,
} from "./terms.interface";

const getPaidFasterSchema = new Schema<TGetPaidFaster>(
  {
    invoice: { type: Boolean, default: false },
    credit_note: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    pos_balling: { type: Boolean, default: false },
    estimate: { type: Boolean, default: false },
  },
  { _id: false },
);

const getOrganizedSchema = new Schema<TGetOrganized>(
  {
    expense: { type: Boolean, default: false },
    time_tracking: { type: Boolean, default: false },
    customer_management: { type: Boolean, default: false },
    reporting: { type: Boolean, default: false },
    purchase_order: { type: Boolean, default: false },
    accounting: { type: Boolean, default: false },
  },
  { _id: false },
);

const featuresSchema = new Schema<TFeatures>(
  {
    get_paid_faster: { type: getPaidFasterSchema, default: () => ({}) },
    get_organized: { type: getOrganizedSchema, default: () => ({}) },
  },
  { _id: false },
);

const platformsSchema = new Schema<TPlatforms>(
  {
    mac: { type: Boolean, default: false },
    ios: { type: Boolean, default: false },
    android: { type: Boolean, default: false },
    windows: { type: Boolean, default: false },
    linux: { type: Boolean, default: false },
  },
  { _id: false },
);

const integrationsSchema = new Schema<TIntegrations>(
  {
    zapier: { type: Boolean, default: false },
    make: { type: Boolean, default: false },
    basecamp: { type: Boolean, default: false },
    all_integrations: { type: Boolean, default: false },
  },
  { _id: false },
);

const byIndustrySchema = new Schema<TByIndustry>(
  {
    freelancers: { type: Boolean, default: false },
    contractors: { type: Boolean, default: false },
    photographers: { type: Boolean, default: false },
    consultants: { type: Boolean, default: false },
    graphic_designers: { type: Boolean, default: false },
    law_firms: { type: Boolean, default: false },
    marketing_agencies: { type: Boolean, default: false },
    non_profits: { type: Boolean, default: false },
    trucking_company: { type: Boolean, default: false },
  },
  { _id: false },
);

const paymentGatewaySchema = new Schema<TPaymentGateway>(
  {
    stripe: { type: Boolean, default: false },
    paypal: { type: Boolean, default: false },
    square: { type: Boolean, default: false },
    razorpay: { type: Boolean, default: false },
    braintree: { type: Boolean, default: false },
    upi: { type: Boolean, default: false },
  },
  { _id: false },
);

const developersSchema = new Schema<TDevelopers>(
  {
    developers_api: { type: Boolean, default: false },
  },
  { _id: false },
);

const solutionsSchema = new Schema<TSolutions>(
  {
    platforms: { type: platformsSchema, default: () => ({}) },
    integrations: { type: integrationsSchema, default: () => ({}) },
    by_industry: { type: byIndustrySchema, default: () => ({}) },
    payment_gateway: { type: paymentGatewaySchema, default: () => ({}) },
    developers: { type: developersSchema, default: () => ({}) },
  },
  { _id: false },
);

const freeToolsSchema = new Schema<TFreeTools>(
  {
    invoice_generator: { type: Boolean, default: false },
    estimate_generator: { type: Boolean, default: false },
    receipt_maker: { type: Boolean, default: false },
    po_generator: { type: Boolean, default: false },
    profit_margin_calculation: { type: Boolean, default: false },
    gst_calculator: { type: Boolean, default: false },
  },
  { _id: false },
);

const freeTemplatesSchema = new Schema<TFreeTemplates>(
  {
    free_invoice_templates: { type: Boolean, default: false },
    free_estimate_templates: { type: Boolean, default: false },
    free_receipt_templates: { type: Boolean, default: false },
    free_po_templates: { type: Boolean, default: false },
  },
  { _id: false },
);

const learnSchema = new Schema<TLearn>(
  {
    blogs: { type: Boolean, default: false },
    comparison: { type: Boolean, default: false },
    newsLetter: { type: Boolean, default: false },
    customer_stories: { type: Boolean, default: false },
  },
  { _id: false },
);

const resourcesSchema = new Schema<TResources>(
  {
    free_templates: { type: freeTemplatesSchema, default: () => ({}) },
    learn: { type: learnSchema, default: () => ({}) },
  },
  { _id: false },
);

const contactUsSchema = new Schema<TContactUs>(
  {
    contact: { type: Boolean, default: false },
    help_center: { type: Boolean, default: false },
  },
  { _id: false },
);

// ✅ Main Schema
const TermsSchema = new Schema<ITerms>(
  {
    description: { type: String, required: true },
    features: { type: featuresSchema, default: () => ({}) },
    solutions: { type: solutionsSchema, default: () => ({}) },
    free_tools: { type: freeToolsSchema, default: () => ({}) },
    resources: { type: resourcesSchema, default: () => ({}) },
    contact_us: { type: contactUsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export const TermsOfUseModel = model<ITerms>("TermsOfUse", TermsSchema);
