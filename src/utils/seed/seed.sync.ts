import { Types } from "mongoose";
import { SettingModel } from "../../modules/make_modules/app.setting/app.setting.model";
import {
  PDFSettingModel,
  documentTypes,
} from "../../modules/make_modules/pdf.setting/pdf.setting.model";
import { pdfSettingService } from "../../modules/make_modules/pdf.setting/pdf.setting.service";
import { TPDFSetting } from "../../modules/make_modules/pdf.setting/pdf.setting.interface";
import { EditTitleModel } from "../../modules/make_modules/editTitles/editTitles.model";
import { CategoryModel } from "../../modules/make_modules/product/category/category.model";
import { setting_seed_data } from "./seed.setting";
import { seedEditTitles, seedCategory } from "./seed.data";
import { pdfSettingSeedDefaults } from "./seed.pdfSetting";

type Dict = Record<string, unknown>;

const isPlainObject = (v: unknown): v is Dict =>
  v !== null && typeof v === "object" && !Array.isArray(v);

const collectMissingPaths = (
  seed: Dict,
  target: Dict | undefined,
  prefix: string,
  out: Dict
): void => {
  for (const key of Object.keys(seed)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const seedVal = seed[key];
    const targetVal = target ? target[key] : undefined;

    if (targetVal === undefined || targetVal === null) {
      out[path] = seedVal;
    } else if (isPlainObject(seedVal) && isPlainObject(targetVal)) {
      collectMissingPaths(seedVal, targetVal, path, out);
    }
  }
};

/**
 * Re-apply the seed data for a company on every login so that updates to the
 * seed (new app-setting fields, new edit titles, new categories, new PDF types)
 * reach already-seeded companies. The sync is ADDITIVE — it never overwrites a
 * company's own customisations, it only fills what is missing.
 */
export const syncCompanySeeds = async (userId: Types.ObjectId | string) => {
  const user_id = userId;

  // 1) App Setting — fill missing keys (keeps the company's edited values).
  const setting = await SettingModel.findOne({ user_id });
  if (!setting) {
    await SettingModel.create({ user_id, ...setting_seed_data });
  } else {
    const missing: Dict = {};
    collectMissingPaths(setting_seed_data as Dict, setting.toObject() as unknown as Dict, "", missing);
    if (Object.keys(missing).length) {
      await SettingModel.updateOne({ user_id }, { $set: missing });
    }
  }

  // 2) PDF & Print — add a default doc for any document type not present yet.
  const existingPdf = await PDFSettingModel.find({ user_id }).select("pdfType").lean();
  const havePdf = new Set<string>(existingPdf.map((p) => String(p.pdfType)));
  for (const type of documentTypes) {
    if (!havePdf.has(type)) {
      await pdfSettingService.PdfSettingCreateDB({
        user_id,
        pdfType: type,
        ...pdfSettingSeedDefaults,
      } as unknown as TPDFSetting);
    }
  }

  // 3) Edit Titles — push seed titles whose name isn't already saved.
  const editTitleDoc = await EditTitleModel.findOne({ user_id });
  if (!editTitleDoc) {
    await EditTitleModel.create({ user_id, titles: seedEditTitles });
  } else {
    const haveTitles = new Set((editTitleDoc.titles as { name: string }[]).map((t) => t.name));
    const missingTitles = seedEditTitles.filter((t) => !haveTitles.has(t.name));
    if (missingTitles.length) {
      await EditTitleModel.updateOne({ user_id }, { $push: { titles: { $each: missingTitles } } });
    }
  }

  // 4) Categories — insert seed categories whose name isn't already saved.
  const existingCategories = await CategoryModel.find({ user_id }).select("category").lean();
  const haveCategories = new Set(existingCategories.map((c) => c.category));
  const missingCategories = seedCategory
    .filter((c) => !haveCategories.has(c.category))
    .map((c) => ({ ...c, user_id }));
  if (missingCategories.length) {
    await CategoryModel.insertMany(missingCategories);
  }
};
