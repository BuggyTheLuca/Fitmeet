import { ActivityResponse } from "./activity"

export interface Pageable {
    page: number,
    pageSize: number,
    filter?: string,
    orderBy?: string,
    order?: string
}

export interface ActivityPage { 
    page: number, 
    pageSize: number, 
    totalActivities: number, 
    totalPages: number, 
    previous: number, 
    next: number, 
    activities: ActivityResponse[]
  }