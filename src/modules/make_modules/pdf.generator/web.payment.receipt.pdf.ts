/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import sanitizeHtml from "sanitize-html";
const PDFDocument = require("pdfkit");

const plain = (value: any) => sanitizeHtml(String(value ?? "").replace(/<br\s*\/?\s*>/gi, "\n"), { allowedTags: [], allowedAttributes: {} });
const color = (value: any, fallback: string) => /^#[\da-f]{6}$/i.test(String(value)) ? value : fallback;

/** Read uploaded images from public, independently of the server/tunnel hostname. */
export async function loadWebReceiptImage(value: any): Promise<Buffer | null> {
  if (typeof value !== "string" || !value) return null;
  if (/^data:image\/(png|jpeg);base64,/i.test(value)) {
    const buffer = Buffer.from(value.split(",")[1], "base64");
    return buffer.length <= 5 * 1024 * 1024 ? buffer : null;
  }
  let pathname = value;
  try { if (/^https?:\/\//i.test(value)) pathname = new URL(value).pathname; } catch { return null; }
  if (pathname.startsWith("/files/") || pathname.startsWith("/uploads/")) {
    try {
      const root = path.resolve(process.cwd(), "public");
      const target = path.resolve(root, "." + decodeURIComponent(pathname));
      const relative = path.relative(root, target);
      if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
      const stat = await fs.promises.stat(target);
      if (!stat.isFile() || stat.size > 5 * 1024 * 1024) return null;
      return await fs.promises.readFile(target);
    } catch { return null; }
  }
  if (!/^https?:\/\//i.test(value)) return null;
  return new Promise(resolve => {
    const request = (value.startsWith("https:") ? https : http).get(value, response => {
      if (response.statusCode !== 200) { response.resume(); resolve(null); return; }
      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > 5 * 1024 * 1024) { request.destroy(); resolve(null); }
        else chunks.push(chunk);
      });
      response.on("end", () => resolve(size <= 5 * 1024 * 1024 ? Buffer.concat(chunks) : null));
      response.on("error", () => resolve(null));
    });
    request.setTimeout(5000, () => { request.destroy(); resolve(null); });
    request.on("error", () => resolve(null));
  });
}

/** Website receipt layout only. No legacy generator or database writes. */
export async function renderWebPaymentReceipt(data: any, settings: any): Promise<Buffer> {
  const style = settings.style || {}, header = settings.header || {}, co = settings.company || {};
  const ct = settings.contact || {}, notes = settings.notes_terms || {}, sig = settings.signature || {};
  const footer = settings.footer || {}, receipt = settings.payment_receipt || {};
  const margin = (side: string, minimum: number) => Math.min(100, Math.max(minimum, Number(style.margin?.[side]) || minimum));
  const left = margin("left", 38), right = margin("right", 38), top = margin("top", 26), bottom = margin("bottom", 24);
  const width = 595.28 - left - right, padding = 6, textWidth = width - padding * 2;
  const ink = color(style.text_color, "#ffc000"), border = color(style.border_color, "#80b64a");
  const fill = color(style.fill_color, "#d0d0d0"), fillInk = color(style.fill_text_color, "#000000");
  const font = style.font === "times" ? "Times-Roman" : style.font === "courier" ? "Courier" : "Helvetica";
  const boldFont = style.font === "times" ? "Times-Bold" : style.font === "courier" ? "Courier-Bold" : "Helvetica-Bold";
  const fontSize = style.font_size === "small" ? 8 : style.font_size === "large" ? 10 : 9;
  const lineHeight = fontSize + 3;
  // The reference receipt uses this portrait aspect ratio, with a full-height
  // frame and a large blank area below the payment/invoice tables.
  const doc = new PDFDocument({ size: [595.28, 744], margins: { top: top + padding, bottom: bottom + padding + 16, left, right }, bufferPages: true });
  const chunks: Buffer[] = [];
  const completed = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  let y = top + padding;
  const room = (height: number) => {
    if (y + height > doc.page.height - bottom - padding - 16) { doc.addPage(); y = top + padding; }
  };
  const line = (value: any, options: any = {}) => {
    const content = plain(value);
    if (!content) return;
    doc.font(options.bold ? boldFont : font).fontSize(options.size || fontSize);
    const height = doc.heightOfString(content, { width: textWidth, ...options });
    const advance = Math.max(options.advance || lineHeight, height);
    room(Math.min(advance, doc.page.height - top - bottom - padding * 2 - 16));
    const startPage = doc.bufferedPageRange().count;
    const startY = y;
    doc.fillColor(ink).text(content, left + padding, y, { width: textWidth, ...options });
    y = doc.bufferedPageRange().count === startPage ? startY + advance : doc.y + 2;
  };
  if (header.header !== false) line("PAYMENT RECEIPT", { bold: true, size: 18, advance: 25, align: header.title_alignment === "right" ? "right" : "center" });
  if (data.sample) line("Sample", { align: "right", size: 8 });
  if (header.logo !== false) {
    const image = await loadWebReceiptImage(data.company.logo);
    const size = header.logo_size === "small" ? 40 : header.logo_size === "large" ? 88 : 60;
    if (image) {
      room(size + 6);
      try { doc.image(image, left + padding, y, { fit: [size, size] }); y += size + 6; } catch { /* Unsupported image: omit without a fake logo. */ }
    }
  }
  const company = data.company;
  const companyFields = [
    ["name", company.name], ["address", company.address], ["country", company.country],
    ["email", company.email], ["phone", company.phone], ["mobile", company.mobile],
    ["fax", company.fax], ["website", company.website], ["Reg_no", company.regNo], ["tax_id", company.taxId],
  ];
  for (const [key, value] of companyFields) {
    if (co[key] !== false) line(value, key === "name" ? { bold: true, size: fontSize + 3, advance: lineHeight + 8 } : {});
  }
  y += 6;
  line("Received From:");
  const customer = data.customer;
  if (ct.first_last_name !== false) {
    line(customer.name);
    if (customer.companyName && customer.companyName !== customer.name) line(customer.companyName);
  }
  for (const [key, value] of [["email", customer.email], ["home_phone", customer.phone], ["business_phone", customer.businessPhone], ["mobaile", customer.phone ? `Mobile: ${customer.phone}` : ""], ["fax", customer.fax]]) {
    if (ct[key] === true || (key === "email" && ct[key] !== false)) line(value);
  }
  const contactAddressLines: string[] = customer.addressLines?.length ? customer.addressLines : customer.address ? [customer.address] : [];
  for (const value of contactAddressLines) line(value, { align: ct.address_alignment === "right" ? "right" : "left" });
  if (ct.tax_id !== false) line(customer.taxId);
  if (ct.reg_no === true) line(customer.regNo);
  y += 3;
  const date = data.date ? new Date(data.date) : null;
  const dateText = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-US", {
    year: "numeric", month: header.date_format === "short" ? "numeric" : header.date_format === "long" ? "long" : "short", day: "numeric",
  }) : "—";
  const amount = `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.amount)} ${data.currency}`;
  type Column = { label: string; value: string; proportion: number };
  const table = (columns: Column[], headerHeight: number) => {
    const totalProportion = columns.reduce((sum, column) => sum + column.proportion, 0);
    const widths = columns.map(column => width * column.proportion / totalProportion);
    doc.font(font).fontSize(fontSize);
    const valueHeight = Math.max(19, ...columns.map((column, index) => doc.heightOfString(plain(column.value), { width: widths[index] - 10 }) + 8));
    room(headerHeight + valueHeight);
    doc.save().fillColor(fill).rect(left, y, width, headerHeight).fill().restore();
    let x = left;
    columns.forEach((column, index) => {
      const cellWidth = widths[index];
      doc.lineWidth(0.6).strokeColor(border);
      if (style.horizontal_lines !== "hide") {
        doc.moveTo(x, y).lineTo(x + cellWidth, y).stroke();
        doc.moveTo(x, y + headerHeight).lineTo(x + cellWidth, y + headerHeight).stroke();
        doc.moveTo(x, y + headerHeight + valueHeight).lineTo(x + cellWidth, y + headerHeight + valueHeight).stroke();
      }
      if (style.vertical_lines !== "hide") doc.moveTo(x, y).lineTo(x, y + headerHeight + valueHeight).stroke();
      doc.font(boldFont).fontSize(fontSize).fillColor(fillInk).text(column.label, x + 5, y + (headerHeight - fontSize) / 2 - 1, { width: cellWidth - 10, lineBreak: false });
      doc.font(font).fillColor(ink).text(plain(column.value), x + 5, y + headerHeight + 4, { width: cellWidth - 10 });
      x += cellWidth;
    });
    if (style.vertical_lines !== "hide") doc.moveTo(x, y).lineTo(x, y + headerHeight + valueHeight).strokeColor(border).stroke();
    y += headerHeight + valueHeight;
  };
  const paymentColumns: Column[] = [];
  if (header.number !== false && receipt.number !== false) paymentColumns.push({ label: "Payment #", value: data.number, proportion: 0.17 });
  paymentColumns.push({ label: "Payment date", value: dateText, proportion: 0.275 });
  if (header.total_amount !== false) paymentColumns.push({ label: "Amount", value: amount, proportion: 0.275 });
  if (receipt.methods !== false) paymentColumns.push({ label: "Payment Type", value: data.method || "—", proportion: 0.28 });
  table(paymentColumns, 21);
  if (data.invoiceNumber) {
    const invoiceColumns: Column[] = [{ label: "Invoice #", value: data.invoiceNumber, proportion: 0.21 }];
    if (header.total_amount !== false) invoiceColumns.push({ label: "Amount", value: amount, proportion: 0.79 });
    table(invoiceColumns, 16);
  }
  // The reference places the signature directly beneath the invoice table,
  // without an amount banner, signature rule, or extra caption.
  if (sig.company_sign && sig.company_sign !== "hide") {
    const image = await loadWebReceiptImage(company.signature);
    const size = sig.signature_size === "large" ? 120 : sig.signature_size === "small" ? 55 : 85;
    const align = ["left", "center", "right"].includes(sig.company_signature_alignment) ? sig.company_signature_alignment : "left";
    if (image) {
      room(45);
      const x = align === "right" ? left + width - size - padding : align === "center" ? left + (width - size) / 2 : left + padding + 6;
      try { doc.image(image, x, y + 10, { fit: [size, 30] }); y += 45; } catch { /* no image */ }
    }
  }
  y += 8;
  if (notes.notes !== false && data.notes) {
    if (notes.notes_title !== false) line("Notes", { bold: true });
    line(data.notes);
  }
  if (notes.terms_and_condition !== false && data.terms) { line("Terms & Conditions", { bold: true }); line(data.terms); }
  const pages = doc.bufferedPageRange();
  for (let i = pages.start; i < pages.start + pages.count; i++) {
    doc.switchToPage(i);
    if (style.outer_border !== "hide") doc.lineWidth(0.6).strokeColor(border).rect(left, top, width, doc.page.height - top - bottom).stroke();
    if (footer.show_tamplate_for_pages === "first" && i > pages.start) continue;
    // Footer is outside the content area. Temporarily remove the bottom margin
    // so PDFKit does not create an extra page while drawing it.
    doc.page.margins.bottom = 0;
    doc.font(font).fontSize(8).fillColor(ink);
    if (footer.created_moon_invoice_hyperlink !== false) doc.text("Created by Qayd", left, doc.page.height - 34, { width, align: "center", lineBreak: false });
    if (receipt.page_number === true) doc.text(`${i - pages.start + 1} / ${pages.count}`, left, doc.page.height - 48, { width, align: ["left", "center", "right"].includes(footer.page_number_alignment) ? footer.page_number_alignment : "right", lineBreak: false });
  }
  doc.end();
  return completed;
}
