import { LeadModel } from "../lead/lead.model";
import { DealModel } from "../deal/deal.model";
import { LeadStageModel } from "../leadStage/leadStage.model";
import { DealStageModel } from "../dealStage/dealStage.model";

const stageFilter = (user_id: string, query: Record<string, unknown>) => {
  const f: Record<string, unknown> = { user_id, isDeleted: false };
  if (query.pipeline_id) f.pipeline_id = query.pipeline_id;
  return f;
};

const leadReportsDB = async (user_id: string, query: Record<string, unknown>) => {
  const leads = await LeadModel.find(stageFilter(user_id, query)).lean();
  const total = leads.length;
  const converted = leads.filter((l) => l.is_converted).length;
  const active = leads.filter((l) => l.is_active && !l.is_converted).length;

  const counts: Record<string, number> = {};
  for (const l of leads) {
    const k = String(l.stage_id || "unassigned");
    counts[k] = (counts[k] || 0) + 1;
  }
  const stages = await LeadStageModel.find(stageFilter(user_id, query)).sort({ order: 1 }).lean();
  const byStage = stages.map((s) => ({ stage_id: s._id, name: s.name, count: counts[String(s._id)] || 0 }));

  return { total, converted, active, byStage };
};

const dealReportsDB = async (user_id: string, query: Record<string, unknown>) => {
  const deals = await DealModel.find(stageFilter(user_id, query)).lean();
  const total = deals.length;
  const totalValue = deals.reduce((s, d) => s + (d.price || 0), 0);
  const won = deals.filter((d) => d.status === "Won").length;
  const lost = deals.filter((d) => d.status === "Lost").length;

  const counts: Record<string, number> = {};
  const values: Record<string, number> = {};
  for (const d of deals) {
    const k = String(d.stage_id || "unassigned");
    counts[k] = (counts[k] || 0) + 1;
    values[k] = (values[k] || 0) + (d.price || 0);
  }
  const stages = await DealStageModel.find(stageFilter(user_id, query)).sort({ order: 1 }).lean();
  const byStage = stages.map((s) => ({
    stage_id: s._id,
    name: s.name,
    count: counts[String(s._id)] || 0,
    value: values[String(s._id)] || 0,
  }));

  return { total, totalValue, won, lost, byStage };
};

export const crmReportService = { leadReportsDB, dealReportsDB };
