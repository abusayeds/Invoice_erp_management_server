import { TResolvedDocument } from "../documentEmail.interface";

const fmtDate = (d: Date | string | null | undefined): string => {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fmtMoney = (total: number | null | undefined, currency: string | null | undefined) => {
  if (total === null || total === undefined || Number.isNaN(Number(total))) return "";
  const cur = currency || "";
  return `${cur} ${Number(total).toFixed(2)}`.trim();
};

/** Build placeholder map from resolved document + company user. */
export const buildTemplateVars = (document: TResolvedDocument): Record<string, string> => ({
  customer_name: document.party_name || "",
  vendor_name: document.party_name || "",
  party_name: document.party_name || "",
  party_email: document.party_email || "",
  company_name: document.company_name || "",
  invoice_number: document.number || "",
  document_number: document.number || "",
  number: document.number || "",
  status: document.status || "",
  total: fmtMoney(document.total, document.currency),
  currency: document.currency || "",
  date: fmtDate(document.date),
  due_date: fmtDate(document.due_date),
});

/** Replace {{key}} placeholders in a string. */
export const mergeTemplateString = (
  template: string | undefined | null,
  vars: Record<string, string>,
): string => {
  if (!template) return "";
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) =>
    vars[key] !== undefined ? vars[key] : "",
  );
};

export const splitEmailList = (value: string | string[] | undefined | null): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return [...new Set(value.map((v) => String(v).trim()).filter(Boolean))];
  }
  return [
    ...new Set(
      String(value)
        .split(/[,;]/)
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ];
};
