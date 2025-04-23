export type NewActivityRequest = {
    title: string,
    description: string,
    typeId: string,
    address: ActivityAddress,
    scheduledDate: Date,
    private: boolean
}

export type UpdateActivityRequest = {
    id: string,
    title?: string,
    description?: string,
    typeId?: string,
    address?: ActivityAddress,
    scheduledDate?: Date,
    private?: boolean
}

export type ActivityToSave = {
    title: string,
    description: string,
    typeId: string,
    image: string,
    address: ActivityAddress,
    scheduledDate: Date,
    createdAt: Date,
    private: boolean,
    creatorId: string,
    confirmationCode: string
}

export type ActivityAddress = {
    latitude: number,
    longitude: number
}