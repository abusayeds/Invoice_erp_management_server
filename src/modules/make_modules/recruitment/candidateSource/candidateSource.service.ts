import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { CandidateSourceModel } from "./candidateSource.model";
import { TCandidateSource } from "./candidateSource.interface";

const P = permission.recruitment.candidate_sources;

export const candidateSourceService = createRecruitmentCrudService<TCandidateSource>({
  model: CandidateSourceModel,
  label: "Candidate source",
  perms: { manageAny: P.manage_any_candidate_sources, manageOwn: P.manage_own_candidate_sources },
  searchFields: ["name", "description"],
  nameField: "name",
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    description: d.description ?? null,
    is_active: d.is_active,
    createdAt: d.createdAt,
  }),
});
