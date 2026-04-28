import { TActivities } from "./activities.interface";
import ActivitiesModel from "./activities.model";

const activitiesCreateDB = async (payload: TActivities) => {
  const activities = ActivitiesModel.create(payload);
  return activities;
};

export const activitiesService = {
  activitiesCreateDB,
};
