export interface ActivityType{
    id: string,
    name: string,
    description: string,
    image: string
}

export interface NewActivity{
    title: string,
    description: string,
    scheduledDate: string,
    typeId: string,
    image: string,
    address: string,
    private: boolean
}

export interface ActivityResponse{ 
    id: string, 
    title: string, 
    description: string, 
    type: string, 
    image: string, 
    confirmationCode: string, 
    participantCount: number, 
    address: { 
      latitude: number, 
      longitude: number 
    }, 
    scheduledDate: string, 
    createdAt: string, 
    completedAt: string, 
    private: boolean, 
    creator: { 
      id: string, 
      name: string, 
      avatar: string 
    }, 
    userSubscriptionStatus: string 
  }