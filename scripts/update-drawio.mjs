import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const OUTPUT_PATHS = [
  path.resolve(repoRoot, "..", "invoicing.drawio"),
  path.resolve(repoRoot, "docs", "invoicing-models.drawio"),
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** ERD table: header = model name, rows = field | type/ref (always expanded — not collapsible) */
function entityTable(id, name, rows, x, y, w = 300, colors = { fill: "#1565C0", stroke: "#0D47A1" }) {
  const rowH = 24;
  const headerH = 32;
  const h = headerH + rows.length * rowH;
  const rowStyle =
    "shape=partialRectangle;connectable=0;fillColor=#FFFFFF;fontColor=#212121;overflow=hidden;whiteSpace=wrap;html=1;fontSize=11;";
  let xml = `        <mxCell id="${id}" parent="1" style="shape=table;startSize=32;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;html=1;fillColor=${colors.fill};fontColor=#FFFFFF;strokeColor=${colors.stroke};" value="${esc(name)}" vertex="1">\n`;
  xml += `          <mxGeometry height="${h}" width="${w}" x="${x}" y="${y}" as="geometry" />\n`;
  xml += `        </mxCell>\n`;
  rows.forEach((row, ri) => {
    const rowId = `${id}-r${ri}`;
    const yOff = 32 + ri * rowH;
    xml += `        <mxCell id="${rowId}" parent="${id}" style="shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=#FFFFFF;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1">\n`;
    xml += `          <mxGeometry height="${rowH}" width="${w}" y="${yOff}" as="geometry" />\n`;
    xml += `        </mxCell>\n`;
    xml += `        <mxCell id="${rowId}-k" parent="${rowId}" style="${rowStyle}fontStyle=1;" value="${esc(row[0])}" vertex="1">\n`;
    xml += `          <mxGeometry height="${rowH}" width="130" as="geometry" />\n`;
    xml += `        </mxCell>\n`;
    xml += `        <mxCell id="${rowId}-v" parent="${rowId}" style="${rowStyle}align=left;spacingLeft=4;fontStyle=0;" value="${esc(row[1])}" vertex="1">\n`;
    xml += `          <mxGeometry height="${rowH}" width="${w - 130}" x="130" as="geometry" />\n`;
    xml += `        </mxCell>\n`;
  });
  return xml;
}

/** Shorthand: modelTable(id, title, mongoCollection, [[field, type/ref],...], x, y, w?, colors?) */
function modelTable(id, title, coll, fields, x, y, w = 290, colors) {
  return entityTable(id, `${title}  ·  ${coll}`, fields, x, y, w, colors);
}

function boxLabel(title, route, note) {
  let s = `<b><font color="#000000">${title}</font></b>`;
  if (route) s += `<br><font style="font-size:11px" color="#424242">${route}</font>`;
  if (note) s += `<br><font style="font-size:10px" color="#616161">${note}</font>`;
  return esc(s);
}

const BOX_STYLE =
  "rounded=1;whiteSpace=wrap;html=1;align=left;spacingLeft=8;fillColor=#FFFFFF;fontColor=#000000;strokeWidth=1;";

const PAL = {
  user: { fill: "#2E7D32", stroke: "#1B5E20" },
  sales: { fill: "#1565C0", stroke: "#0D47A1" },
  purchase: { fill: "#C62828", stroke: "#B71C1C" },
  account: { fill: "#00695C", stroke: "#004D40" },
  catalog: { fill: "#6A1B9A", stroke: "#4A148C" },
  goal: { fill: "#E65100", stroke: "#BF360C" },
  budget: { fill: "#5D4037", stroke: "#3E2723" },
  doubleEntry: { fill: "#37474F", stroke: "#263238" },
  note: { fill: "#F57F17", stroke: "#E65100" },
};

function pageTitle(id, text, x, y, w = 900) {
  return `        <mxCell id="${id}" parent="1" style="text;html=1;fontSize=18;fontStyle=1;fontColor=#000000;strokeColor=none;fillColor=none;align=left;" value="${esc(text)}" vertex="1">\n          <mxGeometry x="${x}" y="${y}" width="${w}" height="30" as="geometry" />\n        </mxCell>\n`;
}

function legendBox(id, x, y) {
  return `        <mxCell id="${id}" parent="1" style="text;html=1;fillColor=#FFF9C4;strokeColor=#666666;fontColor=#212121;align=left;fontSize=11;spacing=4;" value="&lt;b&gt;কীভাবে পড়বেন&lt;/b&gt;&lt;br&gt;• বাম কলাম = ফিল্ডের নাম&lt;br&gt;• ডান কলাম = টাইপ বা → connect&lt;br&gt;• নীল তীর = FK সম্পর্ক&lt;br&gt;• টেবিলের + চাপলে ভাঁজ হয় না (সবসময় খোলা)" vertex="1">\n          <mxGeometry x="${x}" y="${y}" width="320" height="95" as="geometry" />\n        </mxCell>\n`;
}

function flowBox(id, text, x, y, w, h, stroke, dark = false) {
  const fill = dark ? PAL.account.fill : "#FFFFFF";
  const fc = dark ? "#FFFFFF" : "#000000";
  return `<mxCell id="${id}" parent="1" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};fontColor=${fc};strokeColor=${stroke};strokeWidth=2;align=center;fontSize=11;" value="${esc(text)}" vertex="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
}

/** FK / relation arrow with label (field name) */
function refEdge(id, source, target, label = "") {
  let xml = `<mxCell id="${id}" edge="1" parent="1" source="${source}" target="${target}" style="endArrow=blockThin;html=1;rounded=1;strokeWidth=2;strokeColor=#1565C0;exitX=1;exitY=0.5;entryX=0;entryY=0.5;">`;
  xml += `<mxGeometry relative="1" as="geometry"/></mxCell>`;
  if (label) {
    xml += `<mxCell id="${id}-lbl" connectable="0" parent="${id}" style="edgeLabel;html=1;align=center;fontSize=10;fontColor=#0D47A1;fillColor=#FFFFFF;fontStyle=1;" value="${esc(label)}" vertex="1"><mxGeometry relative="1" x="-0.1" as="geometry"><mxPoint as="offset"/></mxGeometry></mxCell>`;
  }
  return xml;
}

function arrowEdge(id, source, target, label = "") {
  let xml = `<mxCell id="${id}" edge="1" parent="1" source="${source}" target="${target}" style="endArrow=classic;html=1;rounded=1;strokeWidth=2;strokeColor=#333333;">`;
  xml += `<mxGeometry relative="1" as="geometry"/></mxCell>`;
  if (label) {
    xml += `<mxCell id="${id}-lbl" connectable="0" parent="${id}" style="edgeLabel;html=1;align=center;fontSize=10;fontColor=#000000;fillColor=#FFFFFF;" value="${esc(label)}" vertex="1"><mxGeometry relative="1" as="geometry"><mxPoint as="offset"/></mxGeometry></mxCell>`;
  }
  return xml;
}

function wrapDiagram(name, id, cells, pw = 1600, ph = 1200) {
  return `  <diagram name="${name}" id="${id}">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${pw}" pageHeight="${ph}" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        ${cells}
      </root>
    </mxGraphModel>
  </diagram>`;
}

// ─── 00 Index ───
function pageIndex() {
  const today = new Date().toISOString().slice(0, 10);
  let c = `<mxCell id="idx-title" parent="1" style="text;html=1;fontSize=24;fontStyle=1;fontColor=#000000;strokeColor=none;fillColor=none;align=left;" value="invoice_server — MongoDB models &amp; connections (${today})" vertex="1"><mxGeometry x="40" y="30" width="900" height="40" as="geometry"/></mxCell>`;
  const tabs = [
    ["00-Index", "নেভিগেশন"],
    ["01-Auth draft", "আপনার আগের স্কেচ"],
    ["02-Module Map", "API route map"],
    ["03-Returns flow", "Return approve → notes"],
    ["04-User models", "User + businessProfile — সব ফিল্ড"],
    ["05-Sales models", "Invoice, Return, CreditNote, Product"],
    ["06-Purchase models", "PO, Return, DebitNote, Bill"],
    ["07-Account models", "COA, Bank, Payment, Revenue"],
    ["08-Goal models", "Goal, Milestone, Contribution, Tracking"],
    ["09-Master links", "সব মডেল এক নজরে connect"],
    ["10-Goal flow", "tracking logic"],
    ["11-Budget models", "Period, Budget, Allocation, Monitoring"],
    ["12-Budget flow", "spending + monitoring"],
    ["13-Double Entry", "Journal, Balance Sheet, Reports"],
  ];
  tabs.forEach((t, i) => {
    c += `<mxCell id="idx-${i}" parent="1" style="rounded=1;whiteSpace=wrap;html=1;align=left;spacingLeft=12;fillColor=#FFFFFF;strokeColor=#666666;fontColor=#000000;fontSize=13;" value="&lt;b&gt;${esc(t[0])}&lt;/b&gt;&lt;br&gt;&lt;font color=&quot;#424242&quot;&gt;${esc(t[1])}&lt;/font&gt;" vertex="1"><mxGeometry x="40" y="${95 + i * 58}" width="500" height="48" as="geometry"/></mxCell>`;
  });
  c += `<mxCell id="idx-path" parent="1" style="text;html=1;align=left;fillColor=#FFF9C4;strokeColor=#666666;fontColor=#212121;spacing=6;fontSize=11;" value="File: d:\\sayed\\invoicing\\invoicing.drawio&#xa;Script: invoice_server/scripts/update-drawio.mjs&#xa;Source: src/modules/**/**.model.ts" vertex="1"><mxGeometry x="580" y="95" width="400" height="70" as="geometry"/></mxCell>`;
  return wrapDiagram("00-Index", "index-page", c, 1100, 750);
}

// ─── 02 Module map ───
function pageModuleMap() {
  const modules = [
    { id: "core", title: "CORE", color: "#d5e8d4", stroke: "#82b366", x: 40, y: 50, items: [
      ["User", "/user", "→ tab 04"],
      ["Permission, Setting", "...", ""],
    ]},
    { id: "party", title: "PARTIES (User collection)", color: "#fff2cc", stroke: "#d6b656", x: 40, y: 200, items: [
      ["Customer", "/customer", "role=customer"],
      ["Vendor", "/vendor", "role=vendor"],
    ]},
    { id: "sales", title: "SALES", color: "#dae8fc", stroke: "#6c8ebf", x: 360, y: 50, items: [
      ["Invoice", "/invoice", "→ tab 05"],
      ["InvoiceReturn", "/invoice-return", ""],
      ["CreditNote", "/account/credit-notes", ""],
    ]},
    { id: "purchase", title: "PURCHASE", color: "#f8cecc", stroke: "#b85450", x: 360, y: 280, items: [
      ["PurchaseOrder", "/purchase-order", "→ tab 06"],
      ["ReturnPurchase", "/purchase-order-return", ""],
      ["DebitNote", "/account/debit-notes", ""],
    ]},
    { id: "account", title: "ACCOUNT", color: "#b2dfdb", stroke: "#00695C", x: 680, y: 50, items: [
      ["ChartOfAccount", "/chart-of-accounts", "→ tab 07"],
      ["BankAccount", "/bank-accounts", ""],
      ["CustomerPayment", "/customer-payments", ""],
      ["AccountRevenue", "/revenues", "→ Goal auto"],
    ]},
    { id: "goal", title: "GOAL", color: "#ffe6cc", stroke: "#d79b00", x: 680, y: 280, items: [
      ["FinancialGoal", "/goal/goals", "→ tab 08"],
      ["GoalContribution", "/goal/contributions", ""],
    ]},
    { id: "budget", title: "BUDGET PLANNER", color: "#efebe9", stroke: "#5D4037", x: 40, y: 430, items: [
      ["BudgetPeriod", "/budget-planner/budget-periods", "→ tab 11"],
      ["BudgetPlan", "/budget-planner/budgets", ""],
      ["BudgetAllocation", "/budget-planner/budget-allocations", ""],
      ["BudgetMonitoring", "/budget-planner/budget-monitoring", ""],
    ]},
    { id: "de", title: "DOUBLE ENTRY", color: "#eceff1", stroke: "#37474F", x: 360, y: 430, items: [
      ["JournalEntry", "account post → journal", "→ tab 13"],
      ["BalanceSheet", "/double-entry/balance-sheets", ""],
      ["TrialBalance", "/double-entry/trial-balance", ""],
    ]},
  ];
  let cells = pageTitle("map-t", "02 — API modules (details on tabs 04–09)", 40, 15, 600);
  modules.forEach((sw) => {
    const swId = `sw-${sw.id}`;
    const h = 28 + sw.items.length * 52 + 12;
    cells += `<mxCell id="${swId}" parent="1" style="swimlane;horizontal=0;whiteSpace=wrap;html=1;fillColor=${sw.color};strokeColor=${sw.stroke};fontStyle=1;fontColor=#000000;startSize=26;" value="${esc(sw.title)}" vertex="1"><mxGeometry height="${h}" width="280" x="${sw.x}" y="${sw.y}" as="geometry"/></mxCell>`;
    sw.items.forEach((it, i) => {
      cells += `<mxCell id="box-${sw.id}-${i}" parent="${swId}" style="${BOX_STYLE}strokeColor=${sw.stroke};" value="${boxLabel(it[0], it[1], it[2])}" vertex="1"><mxGeometry height="46" width="260" x="10" y="${32 + i * 52}" as="geometry"/></mxCell>`;
    });
  });
  [["box-party-0","m-inv","customer_id"],["box-party-1","m-po","vendor_id"],["box-sales-1","m-cn","credit_note_id"],["box-account-4","m-goal","account_id"]].forEach(([a,b,l], i) => {
    cells += `<mxCell id="map-e${i}" edge="1" parent="1" style="endArrow=classic;dashed=1;strokeColor=#999;html=1;" value="${esc(l)}"><mxGeometry relative="1" as="geometry"/></mxCell>`;
  });
  cells += `<mxCell id="map-note" parent="1" style="text;html=1;fillColor=#E3F2FD;strokeColor=#1565C0;fontColor=#212121;align=left;fontSize=11;" value="${esc("Tab 04–09 = প্রতিটি MongoDB model-এ কী data আছে + কোন ফিল্ড দিয়ে connect")}" vertex="1"><mxGeometry x="40" y="480" width="400" height="40" as="geometry"/></mxCell>`;
  return wrapDiagram("02-Module Map", "module-map", cells, 1000, 560);
}

// ─── 03 Returns flow ───
function pageReturns() {
  let c = pageTitle("rf-title", "03 — Return approve → CreditNote / DebitNote", 40, 20, 520);
  c += flowBox("rf1", "Invoice", 60, 90, 130, 48, PAL.sales.stroke);
  c += flowBox("rf2", "InvoiceReturn&#xa;invoice_id → Invoice", 210, 90, 150, 48, PAL.note.stroke);
  c += flowBox("rf3", "approve/:id", 380, 90, 120, 48, PAL.user.stroke);
  c += flowBox("rf4", "CreditNote&#xa;return_id, source_invoice_id", 520, 85, 160, 54, PAL.account.stroke, true);
  c += flowBox("rf5", "PurchaseOrder", 60, 220, 130, 48, PAL.purchase.stroke);
  c += flowBox("rf6", "ReturnPurchase", 210, 220, 150, 48, PAL.note.stroke);
  c += flowBox("rf7", "DebitNote", 520, 215, 160, 54, PAL.account.stroke, true);
  [["rf1","rf2"],["rf2","rf3"],["rf3","rf4"],["rf5","rf6"],["rf6","rf7"]].forEach(([a,b], i) => {
    c += `<mxCell id="erf-${i}" edge="1" parent="1" source="${a}" target="${b}" style="endArrow=classic;html=1;"><mxGeometry relative="1" as="geometry"/></mxCell>`;
  });
  return wrapDiagram("03-Returns flow", "returns-flow", c, 900, 360);
}

// ─── 04 User ───
function pageUserModels() {
  let c = pageTitle("u-t", "04 — User model: কোন data আছে + party হিসেবে কোথায় connect", 40, 12, 800);
  c += legendBox("u-leg", 40, 48);
  c += modelTable("m-user", "User", "users", [
    ["_id", "ObjectId PK"],
    ["email, password, name", "String"],
    ["phone, currency, country", "String"],
    ["role", "company|staff|customer|vendor|client"],
    ["companyId", "→ User (company owner)"],
    ["businessProfile", "embedded object ↓"],
    ["subscriptionId", "→ Purchase"],
    ["permissions", "String[]"],
    ["isDeleted, isVerify", "Boolean"],
    ["createdAt, updatedAt", "Date"],
  ], 400, 48, 300, PAL.user);
  c += modelTable("m-bp", "businessProfile", "(inside User)", [
    ["companyName, tax_id", "String"],
    ["firstName, lastName", "String"],
    ["mobile, BusinessPhone", "String"],
    ["address", "embedded address"],
    ["billingAddress", "embedded address"],
    ["opening_balance", "Number"],
    ["opening_balance_date", "Date"],
    ["active, archive", "Boolean"],
    ["payment_reminder", "Boolean"],
  ], 740, 48, 280, PAL.note);
  c += modelTable("m-refs", "যেখানে User connect হয়", "refs on docs", [
    ["Invoice.customer_id", "→ User (customer)"],
    ["Invoice.user_id", "→ User (company)"],
    ["CreditNote.customer_id", "→ User"],
    ["PurchaseOrder.vendor_id", "→ User (vendor)"],
    ["AccountCustomerPayment.customer_id", "→ User"],
    ["AccountVendorPayment.vendor_id", "→ User"],
    ["FinancialGoal.user_id", "→ User (company)"],
  ], 40, 380, 320, PAL.sales);
  c += `<mxCell id="u-embed" edge="1" parent="1" source="m-user" target="m-bp" style="endArrow=open;dashed=1;strokeColor=#666;html=1;fontSize=10;" value="embeds businessProfile"><mxGeometry relative="1" as="geometry"/></mxCell>`;
  c += refEdge("u-r1", "m-user", "m-user", "companyId → self");
  c += refEdge("u-r2", "m-refs", "m-user", "customer_id / vendor_id");
  return wrapDiagram("04-User models", "user-models", c, 1100, 620);
}

// ─── 05 Sales ───
function pageSalesModels() {
  let c = pageTitle("s-t", "05 — Sales models: field-by-field + connection", 40, 12, 800);
  c += legendBox("s-leg", 40, 48);
  c += modelTable("m-user-c", "User", "users", [
    ["role", "customer"],
    ["companyId", "→ company User"],
  ], 40, 160, 220, PAL.user);
  c += modelTable("m-user-co", "User", "users", [
    ["role", "company"],
    ["_id", "= Invoice.user_id"],
  ], 40, 48, 220, PAL.user);
  c += modelTable("m-prod", "Product", "products", [
    ["user_id", "→ User company"],
    ["name, sku, rate", "String/Number"],
    ["stock, category_id", "Number / → Category"],
  ], 40, 320, 220, PAL.catalog);
  c += modelTable("m-inv", "Invoice", "invoices", [
    ["user_id", "→ User (company)"],
    ["customer_id", "→ User (customer)"],
    ["warehouse_id", "→ Warehouse"],
    ["invoice_number", "String"],
    ["date, due_date", "Date"],
    ["product[]", "product_id→Product, qty, rate"],
    ["service[]", "service_id→Service"],
    ["sub_total, tax, discount", "Number"],
    ["total", "Number"],
    ["paid_amount", "Number"],
    ["balance_amount", "Number"],
    ["status", "Draft|Sent|Paid|..."],
    ["isDeleted", "Boolean"],
  ], 300, 48, 300, PAL.sales);
  c += modelTable("m-ir", "InvoiceReturn", "invoicereturns", [
    ["user_id", "→ User company"],
    ["invoice_id", "→ Invoice"],
    ["warehouse_id", "→ Warehouse"],
    ["return_date", "Date"],
    ["return_reason", "enum"],
    ["status", "Returned|Approved"],
    ["credit_note_id", "→ CreditNote"],
    ["isDeleted", "Boolean"],
  ], 300, 380, 300, PAL.sales);
  c += modelTable("m-cn", "CreditNote", "creditnotes", [
    ["user_id", "→ User company"],
    ["customer_id", "→ User customer"],
    ["source", "manual | return"],
    ["return_id", "→ InvoiceReturn"],
    ["source_invoice_id", "→ Invoice"],
    ["return_reason", "String"],
    ["product[], service[]", "line items"],
    ["total", "Number"],
    ["applied_amount", "Number"],
    ["balance_amount", "Number"],
    ["status", "Draft|Approved"],
  ], 640, 48, 300, PAL.account);
  c += modelTable("m-wh", "Warehouse", "warehouses", [
    ["user_id", "→ User"],
    ["name", "String"],
  ], 640, 380, 220, PAL.catalog);
  c += refEdge("s-e1", "m-inv", "m-user-co", "user_id");
  c += refEdge("s-e2", "m-inv", "m-user-c", "customer_id");
  c += refEdge("s-e3", "m-inv", "m-prod", "product[].product_id");
  c += refEdge("s-e4", "m-ir", "m-inv", "invoice_id");
  c += refEdge("s-e5", "m-ir", "m-wh", "warehouse_id");
  c += refEdge("s-e6", "m-cn", "m-ir", "return_id");
  c += refEdge("s-e7", "m-cn", "m-inv", "source_invoice_id");
  c += refEdge("s-e8", "m-ir", "m-cn", "credit_note_id");
  c += refEdge("s-e9", "m-cn", "m-user-c", "customer_id");
  return wrapDiagram("05-Sales models", "sales-models", c, 1000, 720);
}

// ─── 06 Purchase ───
function pagePurchaseModels() {
  let c = pageTitle("p-t", "06 — Purchase models: field + connection", 40, 12, 700);
  c += legendBox("p-leg", 40, 48);
  c += modelTable("m-vendor", "User", "users", [["role", "vendor"], ["companyId", "→ company"]], 40, 160, 220, PAL.user);
  c += modelTable("m-po", "PurchaseOrder", "purchaseorders", [
    ["user_id", "→ User company"],
    ["vendor_id", "→ User vendor"],
    ["product[], service[]", "line items"],
    ["total, status", "Number / enum"],
    ["isDeleted", "Boolean"],
  ], 300, 48, 290, PAL.purchase);
  c += modelTable("m-bill", "Bill", "bills", [
    ["user_id", "→ User company"],
    ["vendor_id", "→ User vendor"],
    ["product[], service[]", "lines"],
    ["total, paid_amount", "Number"],
    ["balance_amount", "Number"],
  ], 300, 280, 290, PAL.purchase);
  c += modelTable("m-rp", "ReturnPurchase", "returnpurchases", [
    ["user_id", "→ User company"],
    ["purchase_order_id", "→ PurchaseOrder"],
    ["warehouse_id", "→ Warehouse"],
    ["return_date", "Date"],
    ["return_reason", "enum"],
    ["status", "Returned|Approved"],
    ["debit_note_id", "→ DebitNote"],
  ], 640, 48, 290, PAL.purchase);
  c += modelTable("m-dn", "DebitNote", "debitnotes", [
    ["user_id", "→ User company"],
    ["vendor_id", "→ User vendor"],
    ["source", "manual | return"],
    ["return_id", "→ ReturnPurchase"],
    ["source_invoice_id", "→ PO/Bill ref"],
    ["total, applied_amount", "Number"],
    ["balance_amount", "Number"],
    ["status", "Draft|Approved"],
  ], 640, 300, 290, PAL.account);
  c += refEdge("p-e1", "m-po", "m-vendor", "vendor_id");
  c += refEdge("p-e2", "m-bill", "m-vendor", "vendor_id");
  c += refEdge("p-e3", "m-rp", "m-po", "purchase_order_id");
  c += refEdge("p-e4", "m-rp", "m-dn", "debit_note_id");
  c += refEdge("p-e5", "m-dn", "m-rp", "return_id");
  c += refEdge("p-e6", "m-dn", "m-vendor", "vendor_id");
  return wrapDiagram("06-Purchase models", "purchase-models", c, 1000, 680);
}

// ─── 07 Account ───
function pageAccountModels() {
  let c = pageTitle("a-t", "07 — Account models: COA, Bank, Payments, Revenue", 40, 12, 750);
  c += legendBox("a-leg", 40, 48);
  c += modelTable("m-coa", "AccountChartOfAccount", "accountchartofaccounts", [
    ["user_id", "→ User company"],
    ["account_code", "String unique"],
    ["account_name", "String"],
    ["normal_balance", "credit | debit"],
    ["opening_balance", "Number"],
    ["current_balance", "Number"],
    ["account_type_id", "→ AccountType"],
    ["parent_account_id", "→ self (tree)"],
    ["is_active", "Boolean"],
  ], 40, 160, 300, PAL.account);
  c += modelTable("m-bank", "AccountBankAccount", "accountbankaccounts", [
    ["user_id", "→ User company"],
    ["account_number, account_name", "String"],
    ["bank_name, branch_name", "String"],
    ["opening_balance", "Number"],
    ["current_balance", "Number"],
    ["gl_account_id", "→ AccountChartOfAccount"],
  ], 40, 430, 300, PAL.account);
  c += modelTable("m-rev", "AccountRevenue", "accountrevenues", [
    ["user_id", "→ User company"],
    ["revenue_date", "Date"],
    ["category_id", "→ AccountRevenueCategory"],
    ["bank_account_id", "→ AccountBankAccount"],
    ["chart_of_account_id", "→ COA"],
    ["amount", "Number"],
    ["status", "draft|approved|posted"],
    ["POST → auto Goal", "if COA linked"],
  ], 380, 48, 300, PAL.account);
  c += modelTable("m-exp", "AccountExpense", "accountexpenses", [
    ["user_id", "→ User company"],
    ["expense_date", "Date"],
    ["category_id", "→ AccountExpenseCategory"],
    ["bank_account_id", "→ AccountBankAccount"],
    ["chart_of_account_id", "→ COA"],
    ["amount", "Number"],
    ["status", "draft|approved|posted"],
  ], 380, 280, 300, PAL.account);
  c += modelTable("m-cpay", "AccountCustomerPayment", "accountcustomerpayments", [
    ["user_id", "→ User company"],
    ["customer_id", "→ User customer"],
    ["bank_account_id", "→ AccountBankAccount"],
    ["payment_amount", "Number"],
    ["allocations[]", "invoice_id→Invoice, amount"],
    ["credit_notes[]", "credit_note_id→CreditNote"],
    ["status", "pending|completed"],
  ], 720, 48, 310, PAL.account);
  c += modelTable("m-btx", "AccountBankTransaction", "accountbanktransactions", [
    ["bank_account_id", "→ AccountBankAccount"],
    ["transaction_date", "Date"],
    ["transaction_type", "credit | debit"],
    ["amount", "Number"],
    ["reference_number", "String"],
    ["transaction_status", "cleared|..."],
  ], 720, 340, 310, PAL.account);
  c += modelTable("m-inv-pay", "Invoice", "invoices", [
    ["paid_amount", "updated by payment"],
    ["balance_amount", "total - paid"],
  ], 720, 560, 260, PAL.sales);
  c += refEdge("a-e1", "m-bank", "m-coa", "gl_account_id");
  c += refEdge("a-e2", "m-rev", "m-coa", "chart_of_account_id");
  c += refEdge("a-e3", "m-rev", "m-bank", "bank_account_id");
  c += refEdge("a-e4", "m-exp", "m-coa", "chart_of_account_id");
  c += refEdge("a-e5", "m-cpay", "m-bank", "bank_account_id");
  c += refEdge("a-e6", "m-cpay", "m-inv-pay", "allocations.invoice_id");
  c += refEdge("a-e7", "m-btx", "m-bank", "bank_account_id");
  return wrapDiagram("07-Account models", "account-models", c, 1100, 780);
}

// ─── 08 Goal ───
function pageGoalModels() {
  let c = pageTitle("g-t", "08 — Goal models: সব ফিল্ড + Account COA link", 40, 12, 750);
  c += legendBox("g-leg", 40, 48);
  c += modelTable("m-gcat", "GoalCategory", "goalcategories", [
    ["user_id", "→ User company"],
    ["creator_id", "→ User staff"],
    ["category_name", "String"],
    ["category_code", "String unique/tenant"],
    ["description", "String"],
    ["is_active", "Boolean"],
    ["isDeleted", "Boolean"],
  ], 40, 160, 280, PAL.goal);
  c += modelTable("m-goal", "FinancialGoal", "financialgoals", [
    ["user_id", "→ User company"],
    ["creator_id", "→ User"],
    ["category_id", "→ GoalCategory"],
    ["account_id", "→ AccountChartOfAccount"],
    ["goal_name", "String"],
    ["goal_type", "savings|debt_reduction|expense_reduction"],
    ["target_amount", "Number"],
    ["current_amount", "Number"],
    ["start_date, target_date", "Date"],
    ["priority", "low|medium|high|critical"],
    ["status", "draft|active|completed|..."],
  ], 360, 48, 300, PAL.goal);
  c += modelTable("m-gms", "GoalMilestone", "goalmilestones", [
    ["user_id", "→ User company"],
    ["goal_id", "→ FinancialGoal"],
    ["milestone_name", "String"],
    ["target_amount", "Number (Σ≤goal.target)"],
    ["target_date", "Date"],
    ["achieved_amount", "Number"],
    ["achieved_date", "Date?"],
    ["status", "pending|achieved|overdue"],
  ], 360, 340, 300, PAL.goal);
  c += modelTable("m-gct", "GoalContribution", "goalcontributions", [
    ["user_id", "→ User company"],
    ["goal_id", "→ FinancialGoal"],
    ["contribution_date", "Date"],
    ["contribution_amount", "Number"],
    ["contribution_type", "manual|automatic"],
    ["reference_type", "bank_transaction|manual"],
    ["reference_id", "ObjectId"],
    ["notes", "String"],
  ], 700, 48, 300, PAL.goal);
  c += modelTable("m-gtr", "GoalTracking", "goaltrackings", [
    ["user_id", "→ User company"],
    ["goal_id", "→ FinancialGoal"],
    ["tracking_date", "Date"],
    ["previous_amount", "Number"],
    ["contribution_amount", "Number"],
    ["current_amount", "Number"],
    ["progress_percentage", "Number"],
    ["days_remaining", "Number"],
    ["projected_completion_date", "Date"],
    ["on_track_status", "ahead|on_track|behind"],
  ], 700, 300, 300, PAL.goal);
  c += modelTable("m-coa-g", "AccountChartOfAccount", "accountchartofaccounts", [
    ["normal_balance", "credit | debit"],
    ["Revenue POST", "→ auto contribution"],
    ["Expense POST", "→ auto contribution"],
  ], 40, 430, 280, PAL.account);
  c += refEdge("g-e1", "m-goal", "m-gcat", "category_id");
  c += refEdge("g-e2", "m-goal", "m-coa-g", "account_id");
  c += refEdge("g-e3", "m-gms", "m-goal", "goal_id");
  c += refEdge("g-e4", "m-gct", "m-goal", "goal_id");
  c += refEdge("g-e5", "m-gtr", "m-goal", "goal_id");
  c += refEdge("g-e6", "m-coa-g", "m-goal", "linked goals");
  return wrapDiagram("08-Goal models", "goal-models", c, 1100, 720);
}

// ─── 09 Master overview ───
function pageMasterLinks() {
  let c = pageTitle("m-t", "09 — Master: কোন model কোন model-এর সাথে connect (সারাংশ)", 40, 12, 900);
  c += legendBox("m-leg", 40, 48);

  const nodes = [
    ["hub-user", "User\n(company, customer, vendor)", 400, 200, 200, 70, PAL.user],
    ["hub-inv", "Invoice", 80, 80, 140, 50, PAL.sales],
    ["hub-ir", "InvoiceReturn", 80, 180, 140, 50, PAL.sales],
    ["hub-cn", "CreditNote", 80, 280, 140, 50, PAL.account],
    ["hub-po", "PurchaseOrder", 720, 80, 150, 50, PAL.purchase],
    ["hub-rp", "ReturnPurchase", 720, 180, 150, 50, PAL.purchase],
    ["hub-dn", "DebitNote", 720, 280, 140, 50, PAL.account],
    ["hub-coa", "AccountChartOfAccount", 400, 380, 200, 50, PAL.account],
    ["hub-bank", "AccountBankAccount", 200, 380, 170, 50, PAL.account],
    ["hub-cpay", "CustomerPayment", 200, 480, 170, 50, PAL.account],
    ["hub-rev", "AccountRevenue", 620, 380, 150, 50, PAL.account],
    ["hub-goal", "FinancialGoal", 620, 480, 150, 50, PAL.goal],
    ["hub-prod", "Product", 400, 80, 120, 50, PAL.catalog],
    ["hub-bper", "BudgetPeriod", 40, 560, 150, 50, PAL.budget],
    ["hub-bud", "BudgetPlan", 220, 560, 140, 50, PAL.budget],
    ["hub-balc", "BudgetAllocation", 400, 560, 160, 50, PAL.budget],
    ["hub-bmon", "BudgetMonitoring", 600, 560, 170, 50, PAL.budget],
  ];

  nodes.forEach(([id, label, x, y, w, h, pal]) => {
    c += flowBox(id, label.replace(/\n/g, "&#xa;"), x, y, w, h, pal.stroke, false);
  });

  const links = [
    ["hub-inv", "hub-user", "user_id, customer_id"],
    ["hub-inv", "hub-prod", "product[].product_id"],
    ["hub-ir", "hub-inv", "invoice_id"],
    ["hub-cn", "hub-ir", "return_id"],
    ["hub-cn", "hub-inv", "source_invoice_id"],
    ["hub-ir", "hub-cn", "credit_note_id"],
    ["hub-po", "hub-user", "vendor_id"],
    ["hub-rp", "hub-po", "purchase_order_id"],
    ["hub-dn", "hub-rp", "return_id"],
    ["hub-bank", "hub-coa", "gl_account_id"],
    ["hub-cpay", "hub-bank", "bank_account_id"],
    ["hub-cpay", "hub-inv", "allocations.invoice_id"],
    ["hub-cpay", "hub-user", "customer_id"],
    ["hub-rev", "hub-coa", "chart_of_account_id"],
    ["hub-rev", "hub-bank", "bank_account_id"],
    ["hub-goal", "hub-coa", "account_id"],
    ["hub-goal", "hub-user", "user_id"],
    ["hub-rev", "hub-goal", "POST → auto contribute"],
    ["hub-bud", "hub-bper", "period_id"],
    ["hub-balc", "hub-bud", "budget_id"],
    ["hub-balc", "hub-coa", "account_id"],
    ["hub-bmon", "hub-bud", "budget_id"],
    ["hub-rev", "hub-balc", "POST → update spending"],
  ];

  links.forEach(([s, t, l], i) => {
    c += refEdge(`master-${i}`, s, t, l);
  });

  c += `<mxCell id="master-note" parent="1" style="text;html=1;fillColor=#E8F5E9;strokeColor=#2E7D32;fontColor=#212121;align=left;fontSize=11;spacing=4;" value="${esc("Tenant: user_id = company (JWT). Details: tabs 04–08 Goal, 11–12 Budget")}" vertex="1"><mxGeometry x="40" y="640" width="520" height="50" as="geometry"/></mxCell>`;
  return wrapDiagram("09-Master links", "master-links", c, 1000, 720);
}

// ─── 10 Goal flow ───
function pageGoalFlow() {
  let c = pageTitle("gf-t", "10 — Goal tracking flow (কিভাবে follow কাজ করে)", 40, 15, 700);
  c += flowBox("gf1", "FinancialGoal&#xa;status=draft", 40, 70, 140, 50, PAL.goal.stroke);
  c += flowBox("gf2", "GoalTracking (initial)", 210, 70, 150, 50, PAL.goal.stroke);
  c += flowBox("gf3", "activate → active", 390, 70, 140, 50, PAL.goal.stroke, true);
  c += flowBox("gf4", "account_id → COA", 560, 70, 140, 50, PAL.account.stroke);
  c += flowBox("gf5", "Revenue/Expense POST", 40, 180, 160, 50, PAL.account.stroke);
  c += flowBox("gf6", "GoalContribution&#xa;automatic", 230, 180, 150, 50, PAL.goal.stroke, true);
  c += flowBox("gf7", "current_amount +=", 410, 180, 140, 50, PAL.goal.stroke);
  c += flowBox("gf8", "GoalTracking update&#xa;Milestone distribute", 570, 180, 170, 50, PAL.goal.stroke);
  c += flowBox("gf9", "completed", 770, 180, 120, 50, "#2E7D32");
  c += flowBox("gf10", "POST /contributions&#xa;manual", 40, 290, 160, 50, PAL.goal.stroke);
  [["gf1","gf2"],["gf2","gf3"],["gf3","gf4"],["gf4","gf5"],["gf5","gf6"],["gf6","gf7"],["gf7","gf8"],["gf8","gf9"],["gf10","gf6"]].forEach(([a,b], i) => {
    c += arrowEdge(`gff-${i}`, a, b);
  });
  return wrapDiagram("10-Goal flow", "goal-flow", c, 1000, 400);
}

// ─── 11 Budget models ───
function pageBudgetModels() {
  let c = pageTitle("bp-t", "11 — Budget Planner models (Laravel BudgetPlanner package)", 40, 12, 800);
  c += legendBox("bp-leg", 40, 48);
  c += modelTable("m-bper", "BudgetPeriod", "budgetperiods", [
    ["_id", "ObjectId"],
    ["user_id", "→ User (company)"],
    ["period_name", "String"],
    ["financial_year", "String"],
    ["start_date", "Date"],
    ["end_date", "Date"],
    ["status", "draft|approved|active|closed"],
    ["approved_by", "→ User"],
  ], 40, 160, 290, PAL.budget);
  c += modelTable("m-bud", "BudgetPlan", "budgetplans", [
    ["_id", "ObjectId"],
    ["user_id", "→ User"],
    ["period_id", "→ BudgetPeriod"],
    ["budget_name", "String"],
    ["budget_type", "operational|capital|cash_flow"],
    ["total_budget_amount", "Number (Σ allocations)"],
    ["status", "draft|approved|active|closed"],
  ], 360, 48, 300, PAL.budget);
  c += modelTable("m-balc", "BudgetAllocation", "budgetallocations", [
    ["_id", "ObjectId"],
    ["budget_id", "→ BudgetPlan"],
    ["account_id", "→ AccountChartOfAccount"],
    ["allocated_amount", "Number"],
    ["spent_amount", "Number (from COA movement)"],
    ["remaining_amount", "allocated - spent"],
  ], 360, 300, 300, PAL.budget);
  c += modelTable("m-bmon", "BudgetMonitoring", "budgetmonitorings", [
    ["_id", "ObjectId"],
    ["budget_id", "→ BudgetPlan"],
    ["monitoring_date", "Date"],
    ["total_allocated", "Number"],
    ["total_spent", "Number"],
    ["variance_amount", "allocated - spent"],
    ["variance_percentage", "Number"],
  ], 700, 48, 300, PAL.budget);
  c += modelTable("m-coa-b", "AccountChartOfAccount", "accountchartofaccounts", [
    ["_id", "ObjectId"],
    ["account_code", "5000-5999 expense"],
    ["normal_balance", "debit|credit"],
  ], 700, 280, 300, PAL.account);
  c += refEdge("bp-e1", "m-bud", "m-bper", "period_id");
  c += refEdge("bp-e2", "m-balc", "m-bud", "budget_id");
  c += refEdge("bp-e3", "m-balc", "m-coa-b", "account_id");
  c += refEdge("bp-e4", "m-bmon", "m-bud", "budget_id");
  return wrapDiagram("11-Budget models", "budget-models", c, 1100, 620);
}

// ─── 12 Budget flow ───
function pageBudgetFlow() {
  let c = pageTitle("bf-t", "12 — Budget spending flow (Revenue/Expense POST → monitoring)", 40, 15, 800);
  c += flowBox("bf1", "BudgetPeriod&#xa;draft→approved→active", 40, 70, 170, 50, PAL.budget.stroke);
  c += flowBox("bf2", "BudgetPlan&#xa;(active period only)", 240, 70, 160, 50, PAL.budget.stroke);
  c += flowBox("bf3", "BudgetAllocation&#xa;COA 5000-5999", 430, 70, 170, 50, PAL.budget.stroke);
  c += flowBox("bf4", "draft budget → approved&#xa;(first allocation)", 630, 70, 180, 50, PAL.budget.stroke, true);
  c += flowBox("bf5", "AccountRevenue/Expense&#xa;status=posted", 40, 180, 180, 50, PAL.account.stroke);
  c += flowBox("bf6", "calculateActualSpending&#xa;period dates + COA", 250, 180, 190, 50, PAL.budget.stroke);
  c += flowBox("bf7", "spent / remaining&#xa;on allocation", 470, 180, 160, 50, PAL.budget.stroke);
  c += flowBox("bf8", "BudgetMonitoring&#xa;snapshot", 660, 180, 150, 50, PAL.budget.stroke, true);
  c += flowBox("bf9", "Period close →&#xa;budgets closed", 40, 290, 160, 50, PAL.budget.stroke);
  [["bf1","bf2"],["bf2","bf3"],["bf3","bf4"],["bf5","bf6"],["bf6","bf7"],["bf7","bf8"]].forEach(([a, b], i) => {
    c += arrowEdge(`bff-${i}`, a, b);
  });
  return wrapDiagram("12-Budget flow", "budget-flow", c, 900, 400);
}

function pageDoubleEntryModels() {
  let c = pageTitle("de-t", "13 — Double Entry (Journal + Balance Sheet + Reports)", 40, 12, 800);
  c += legendBox("de-leg", 40, 48);
  c += modelTable("m-je", "JournalEntry", "journalentries", [
    ["_id", "ObjectId"],
    ["journal_number", "JE-YYYY-MM-###"],
    ["journal_date", "Date"],
    ["reference_type", "revenue|expense|year_end_close"],
    ["status", "posted"],
    ["total_debit", "Number"],
    ["total_credit", "Number"],
  ], 40, 160, 290, PAL.doubleEntry);
  c += modelTable("m-jei", "JournalEntryItem", "journalentryitems", [
    ["journal_entry_id", "→ JournalEntry"],
    ["account_id", "→ AccountChartOfAccount"],
    ["debit_amount", "Number"],
    ["credit_amount", "Number"],
  ], 360, 160, 290, PAL.doubleEntry);
  c += modelTable("m-bs", "BalanceSheet", "balancesheets", [
    ["balance_sheet_date", "Date"],
    ["financial_year", "String"],
    ["total_assets", "Number"],
    ["status", "draft|finalized"],
  ], 680, 48, 290, PAL.doubleEntry);
  c += modelTable("m-rev", "AccountRevenue", "accountrevenues", [
    ["POST /post", "→ JournalEntry"],
    ["chart_of_account_id", "→ COA"],
    ["bank_account_id", "→ Bank → gl_account_id"],
  ], 680, 260, 290, PAL.account);
  c += refEdge("de-e1", "m-jei", "m-je", "journal_entry_id");
  c += refEdge("de-e2", "m-jei", "m-coa-de", "account_id");
  c += modelTable("m-coa-de", "AccountChartOfAccount", "accountchartofaccounts", [
    ["opening_balance", "Number"],
    ["current_balance", "Number"],
  ], 360, 340, 290, PAL.account);
  c += refEdge("de-e3", "m-rev", "m-je", "post creates");
  return wrapDiagram("13-Double Entry", "double-entry-models", c, 1100, 620);
}

/** Keep only the user's 01-Auth draft page — never append old 04/05/06 ERD duplicates. */
function extractDraftDiagram(xml) {
  const start = xml.indexOf('<diagram name="01-Auth');
  if (start < 0) return "";
  const end = xml.indexOf("</diagram>", start);
  if (end < 0) return "";
  return xml.slice(start, end + "</diagram>".length).trim();
}

function mxfileOpenTag(xml) {
  const m = xml.match(/<mxfile[\s\S]*?>/);
  if (!m) return '<mxfile host="app" agent="update-drawio" version="29.6.6">';
  return m[0].replace(/\spages="[^"]*"/, "");
}

const contentPages =
  pageModuleMap() +
  "\n" +
  pageReturns() +
  "\n" +
  pageUserModels() +
  "\n" +
  pageSalesModels() +
  "\n" +
  pagePurchaseModels() +
  "\n" +
  pageAccountModels() +
  "\n" +
  pageGoalModels() +
  "\n" +
  pageMasterLinks() +
  "\n" +
  pageGoalFlow() +
  "\n" +
  pageBudgetModels() +
  "\n" +
  pageBudgetFlow() +
  "\n" +
  pageDoubleEntryModels();

const primaryPath = OUTPUT_PATHS[0];
let existing = "";
try {
  existing = fs.readFileSync(primaryPath, "utf8");
} catch {
  try {
    existing = fs.readFileSync(OUTPUT_PATHS[1], "utf8");
  } catch {
    existing = "";
  }
}

const draft = extractDraftDiagram(existing);
const today = new Date().toISOString().slice(0, 10);
let out =
  mxfileOpenTag(existing) +
  "\n" +
  pageIndex().replace("2026-05-19", today) +
  "\n" +
  (draft ? `  ${draft}\n` : "") +
  contentPages +
  "\n</mxfile>\n";

if (draft && !out.includes("idx-pointer")) {
  const pointer = `        <mxCell id="idx-pointer" parent="1" style="text;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;align=left;spacing=6;fontSize=11;fontStyle=1;" value="⬇ Tabs: 00-Index → 04-User → 05-Sales → 09-Master" vertex="1"><mxGeometry x="-220" y="140" width="260" height="70" as="geometry"/></mxCell>\n`;
  out = out.replace("<mxCell id=\"b58mrdMEyAsB3EiimtWY-72\"", pointer + '        <mxCell id="b58mrdMEyAsB3EiimtWY-72"');
}

function assertValidXml(xml) {
  if (/value="[^"]*<(?![/])/.test(xml)) {
    const m = xml.match(/value="[^"]*<(?![/])/);
    throw new Error(`Invalid XML: unescaped '<' in attribute near: ${m[0].slice(0, 80)}...`);
  }
}

assertValidXml(out);

for (const outPath of OUTPUT_PATHS) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out, "utf8");
  const stat = fs.statSync(outPath);
  console.log("Wrote:", outPath);
  console.log("  size:", stat.size, "bytes, modified:", stat.mtime.toISOString());
}
console.log(`Pages: 00-Index, ${draft ? "01-draft, " : ""}02-Map … 10-Flow`);
console.log("⚠ draw.io বন্ধ করে ফাইল খুলুন — Merge করবেন না। Tab: 05-Sales models");
