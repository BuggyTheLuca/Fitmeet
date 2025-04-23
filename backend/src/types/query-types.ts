export type Page = {
    page: number,
    pageSize: number
}

export type ActivityQueryFilter = {
    typeId?: string,
    orderBy?: string,
    order?: string
}