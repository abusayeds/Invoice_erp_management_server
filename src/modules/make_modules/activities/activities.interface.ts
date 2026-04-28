import { Types } from "mongoose"
 
export enum ActivitiesType {
  Updated = "Updated", 
  Created = "Created",
  Archived = "Archived",
  Draft = "Draft",
  Sent = "Sent",
  Invoiced = "Invoiced",
}
export type TActivities = {
    user_id :  Types.ObjectId , 
    title : string ,
    type  :  ActivitiesType ,
    isArchive ? : boolean ,
    isDeleted ? : boolean ,
    createdAt ? : Date , 
    updatedAt ? : Date
}