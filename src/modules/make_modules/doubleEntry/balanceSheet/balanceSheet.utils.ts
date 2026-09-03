const SUB_SECTION_LABELS: Record<string, string> = {
  current_assets: "Current Assets",
  fixed_assets: "Fixed Assets",
  other_assets: "Other Assets",
  current_liabilities: "Current Liabilities",
  long_term_liabilities: "Long Term Liabilities",
  equity: "Equity",
};

const SUB_SECTION_ORDER: Record<string, string[]> = {
  assets: ["current_assets", "fixed_assets", "other_assets"],
  liabilities: ["current_liabilities", "long_term_liabilities"],
  equity: ["equity"],
};

const round2 = (n: number) => Math.round(n * 100) / 100;

type RawItem = {
  _id?: { toString(): string };
  account_id?: {
    _id?: { toString(): string };
    account_code?: string;
    account_name?: string;
    normal_balance?: string;
  };
  section_type: string;
  sub_section: string;
  amount: number;
};

type RawSheet = {
  _id?: { toString(): string };
  balance_sheet_date: Date;
  financial_year: string;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  is_balanced: boolean;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const mapLine = (item: RawItem) => {
  const acc = item.account_id;
  const isObj = acc && typeof acc === "object" && "account_code" in acc;
  return {
    _id: item._id?.toString(),
    account_id: isObj ? acc._id?.toString() : String(acc),
    account_name: isObj ? acc.account_name ?? "" : "",
    account_code: isObj ? acc.account_code ?? "" : "",
    amount: round2(item.amount),
  };
};

const buildSectionSide = (
  grouped: Record<string, Record<string, RawItem[]>>,
  sectionKeys: string[],
  sectionLabel: string
) => {
  const blocks: Array<{
    key: string;
    label: string;
    sub_sections: Array<{
      key: string;
      label: string;
      lines: ReturnType<typeof mapLine>[];
      subtotal: number;
    }>;
    total: number;
  }> = [];

  let grandTotal = 0;

  for (const sectionKey of sectionKeys) {
    const subMap = grouped[sectionKey];
    if (!subMap) continue;

    const order = SUB_SECTION_ORDER[sectionKey] ?? Object.keys(subMap);
    const sub_sections: Array<{
      key: string;
      label: string;
      lines: ReturnType<typeof mapLine>[];
      subtotal: number;
    }> = [];

    let sectionTotal = 0;

    for (const subKey of order) {
      const items = subMap[subKey];
      if (!items?.length) continue;

      const lines = items
        .map(mapLine)
        .sort((a, b) => a.account_code.localeCompare(b.account_code));
      const subtotal = round2(lines.reduce((s, l) => s + l.amount, 0));
      sectionTotal += subtotal;

      sub_sections.push({
        key: subKey,
        label: SUB_SECTION_LABELS[subKey] ?? subKey.replace(/_/g, " "),
        lines,
        subtotal,
      });
    }

    for (const subKey of Object.keys(subMap)) {
      if (order.includes(subKey)) continue;
      const items = subMap[subKey];
      if (!items?.length) continue;
      const lines = items.map(mapLine).sort((a, b) => a.account_code.localeCompare(b.account_code));
      const subtotal = round2(lines.reduce((s, l) => s + l.amount, 0));
      sectionTotal += subtotal;
      sub_sections.push({
        key: subKey,
        label: SUB_SECTION_LABELS[subKey] ?? subKey.replace(/_/g, " "),
        lines,
        subtotal,
      });
    }

    if (sub_sections.length) {
      grandTotal += sectionTotal;
      blocks.push({
        key: sectionKey,
        label: sectionLabel,
        sub_sections,
        total: round2(sectionTotal),
      });
    }
  }

  return { title: sectionLabel, sections: blocks, grand_total: round2(grandTotal) };
};

export const formatBalanceSheetViewResponse = (raw: {
  sheet: RawSheet;
  items: RawItem[];
  groupedItems: Record<string, Record<string, RawItem[]>>;
  notes: Array<{
    _id?: { toString(): string };
    note_number: number;
    note_title: string;
    note_content: string;
  }>;
  allBalanceSheets: Array<{
    _id?: { toString(): string };
    balance_sheet_date: Date;
    financial_year: string;
    status: string;
  }>;
  otherBalanceSheets: Array<{
    _id?: { toString(): string };
    balance_sheet_date: Date;
    financial_year: string;
  }>;
}) => {
  const { sheet, groupedItems, notes, allBalanceSheets, otherBalanceSheets } = raw;
  const asOf = sheet.balance_sheet_date;
  const asOfStr =
    asOf instanceof Date ? asOf.toISOString().slice(0, 10) : String(asOf).slice(0, 10);

  const liabilitiesAndEquity = buildSectionSide(
    groupedItems,
    ["equity", "liabilities"],
    "Liabilities & Equity"
  );

  const assetsSide = buildSectionSide(groupedItems, ["assets"], "Assets");

  const totalLiabilitiesAndEquity = round2(sheet.total_liabilities + sheet.total_equity);

  return {
    balance_sheet: {
      _id: sheet._id?.toString(),
      balance_sheet_date: asOfStr,
      financial_year: sheet.financial_year,
      status: sheet.status,
      is_balanced: sheet.is_balanced,
      as_of_label: `As of ${asOfStr} | Financial Year: ${sheet.financial_year}`,
    },
    summary: {
      total_assets: round2(sheet.total_assets),
      total_liabilities: round2(sheet.total_liabilities),
      total_equity: round2(sheet.total_equity),
      total_liabilities_and_equity: totalLiabilitiesAndEquity,
    },
    badges: {
      balanced: sheet.is_balanced,
      finalized: sheet.status === "finalized",
      draft: sheet.status === "draft",
    },
    liabilities_and_equity: liabilitiesAndEquity,
    assets: assetsSide,
    totals: {
      total_for_liabilities_and_equity: totalLiabilitiesAndEquity,
      total_for_assets: round2(sheet.total_assets),
    },
    notes: notes.map((n) => ({
      _id: n._id?.toString(),
      note_number: n.note_number,
      note_title: n.note_title,
      note_content: n.note_content,
    })),
    all_balance_sheets: allBalanceSheets.map((b) => ({
      _id: b._id?.toString(),
      balance_sheet_date:
        b.balance_sheet_date instanceof Date
          ? b.balance_sheet_date.toISOString().slice(0, 10)
          : String(b.balance_sheet_date).slice(0, 10),
      financial_year: b.financial_year,
      status: b.status,
    })),
    other_balance_sheets: otherBalanceSheets.map((b) => ({
      _id: b._id?.toString(),
      balance_sheet_date:
        b.balance_sheet_date instanceof Date
          ? b.balance_sheet_date.toISOString().slice(0, 10)
          : String(b.balance_sheet_date).slice(0, 10),
      financial_year: b.financial_year,
    })),
    /** Flat list (backward compatible) */
    items: raw.items.map(mapLine),
    grouped_items: groupedItems,
  };
};
