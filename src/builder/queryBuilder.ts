import { FilterQuery, Model, Query } from "mongoose";

/** Search a related collection by text, then match main docs via ObjectId field. */
export type NestedSearchRef = {
  /** ObjectId field on the main document (e.g. `employee_user_id`). */
  foreignField: string;
  model: Model<unknown>;
  /** Top-level string fields on the referenced collection. */
  fields?: string[];
  /** Dot-path string fields (e.g. `businessProfile.companyName`). */
  dotFields?: string[];
  /** Always applied when querying the referenced collection. */
  refFilter?: FilterQuery<unknown>;
};

export type SearchNestedOptions<T> = {
  /** Same-collection fields (regex), like `.search()`. */
  localFields?: Array<keyof T | string>;
  /** Related collections — two-step lookup by `searchTerm`. */
  refs?: NestedSearchRef[];
};

class queryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, Query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = Query;
  }
  search(searchableFields: Array<keyof T>): this {
    const searchTerm = this.query.searchTerm;
    if (typeof searchTerm === 'string') {
      const keywords: string[] = searchTerm
        .trim()
        .split(/\s+/) 
        .filter(Boolean); 
      if (keywords.length > 0) {
        const andConditions = keywords.map((keyword: string) => ({
          $or: searchableFields.map((field: keyof T) => ({
            [field]: { $regex: keyword, $options: "i" },
          })),
        }));
        this.modelQuery = this.modelQuery.find({
          $and: andConditions,
        });
      }
    }
    return this;
  }

  /**
   * Search on local fields + nested/referenced collections (two-step).
   * Uses `searchTerm` from query string — same as `.search()`.
   * Must be awaited before `.filter()` / `.paginate()`.
   *
   * @example
   * await qb.searchNested({
   *   localFields: ["employee_id", "city"],
   *   refs: [{
   *     foreignField: "ref _id",
   *     model: exampleModel,
   *     fields: ["name", "email", "phone"],
   *     refFilter: { companyId, isDeleted: false },
   *   }],
   * });
   */
  async searchNested(options: SearchNestedOptions<T> = {}): Promise<this> {
    const searchTerm = this.query.searchTerm;
    if (typeof searchTerm !== "string") return this; 

    const keywords = searchTerm.trim().split(/\s+/).filter(Boolean);
    if (keywords.length === 0) return this;

    const { localFields = [], refs = [] } = options;
    const andConditions: FilterQuery<T>[] = [];

    for (const keyword of keywords) {
      const orConditions: FilterQuery<T>[] = [];

      for (const field of localFields) {
        orConditions.push({
          [field]: { $regex: keyword, $options: "i" },
        } as FilterQuery<T>);
      }

      for (const ref of refs) {
        const refOr: FilterQuery<unknown>[] = [];
        for (const field of ref.fields ?? []) {
          refOr.push({ [field]: { $regex: keyword, $options: "i" } });
        }
        for (const path of ref.dotFields ?? []) {
          refOr.push({ [path]: { $regex: keyword, $options: "i" } });
        }
        if (refOr.length === 0) continue;

        const refQuery: FilterQuery<unknown> = {
          ...(ref.refFilter ?? {}),
          $or: refOr,
        };
        const ids = await ref.model.find(refQuery).distinct("_id");
        if (ids.length > 0) {
          orConditions.push({
            [ref.foreignField]: { $in: ids },
          } as FilterQuery<T>);
        }
      }

      if (orConditions.length === 0) {
        andConditions.push({ _id: { $in: [] } } as FilterQuery<T>);
      } else {
        andConditions.push({ $or: orConditions });
      }
    }

    this.modelQuery = this.modelQuery.find({ $and: andConditions });
    return this;
  }

  filter() {
  const copyQuery = { ...this?.query };
  const excludeField = ["searchTerm", "sort", "limit", "page", "fields", "startDate", "endDate"];
  excludeField.forEach((el) => delete copyQuery[el]);
  const startDate = this.query?.startDate as string;
  const endDate = this.query?.endDate as string;

  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); 
      dateFilter.$lte = end;
    }
    (copyQuery as any).createdAt = dateFilter;
  }

  this.modelQuery = this?.modelQuery?.find(copyQuery as FilterQuery<T>);
  return this;
}

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async paginate(model: any): Promise<{ totalData: number }> {
    const searchTerm = this.query?.searchTerm;
    const sort = this.query?.sort;
    const filterKeys = Object.keys(this.query || {}).filter(
      (key) => !["searchTerm", "sort", "limit", "page", "fields"].includes(key)
    );
    let totalData;
    if (!searchTerm && !sort && filterKeys.length === 0) {
      totalData = await model.countDocuments();
      const page = Number(this?.query?.page) || 1;
      const limit = Number(this?.query?.limit) || 10;
      const skip = (page - 1) * limit;
      this.modelQuery = this?.modelQuery?.skip(skip).limit(limit);
    } else {
      totalData = await this.modelQuery.clone().countDocuments();
      const page = Number(this?.query?.page) || 1;
      const limit = Number(this?.query?.limit) || 10;
      const skip = (page - 1) * limit;
      this.modelQuery = this?.modelQuery?.skip(skip).limit(limit);
    }
    return { totalData };
  }
  calculatePagination({
    totalData,
    currentPage,
    limit,
  }: {
    totalData: number;
    currentPage: number ;
    limit: number;
  }): {
    totalPage: number;
    currentPage: number;
    prevPage: number 
    nextPage: number 
    totalData: number;
  } {
    const totalPage = Math.ceil(totalData / limit) || 1;
    const prevPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
    const nextPage = currentPage + 1 <= totalPage ? currentPage + 1 : 1;
    return {
      totalPage,
      currentPage,
      prevPage,
      nextPage,
      totalData,
    };
  }
}

export default queryBuilder;