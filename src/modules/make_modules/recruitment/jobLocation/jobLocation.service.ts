import { permission } from "../../../../utils/permission";
import { createRecruitmentCrudService } from "../recruitment.crud.service";
import { JobLocationModel } from "./jobLocation.model";
import { TJobLocation } from "./jobLocation.interface";

const P = permission.recruitment.job_locations;

export const jobLocationService = createRecruitmentCrudService<TJobLocation>({
  model: JobLocationModel,
  label: "Job location",
  perms: { manageAny: P.manage_any_job_locations, manageOwn: P.manage_own_job_locations },
  searchFields: ["name", "city", "state", "country", "address"],
  nameField: "name",
  formatItem: (d) => ({
    _id: d._id,
    name: d.name,
    remote_work: d.remote_work,
    address: d.address ?? null,
    city: d.city ?? null,
    state: d.state ?? null,
    country: d.country ?? null,
    postal_code: d.postal_code ?? null,
    status: d.status,
    createdAt: d.createdAt,
  }),
});
