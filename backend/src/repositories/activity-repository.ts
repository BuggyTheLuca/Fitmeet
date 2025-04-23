import { ActivityParticipant } from "@prisma/client";
import prisma from "../configs/prisma-client";
import { ActivityToSave, UpdateActivityRequest } from "../types/activity-types";
import { ActivityQueryFilter, Page } from "../types/query-types";
import { UserSubscriptionStatusEnum } from "../enums/user-subscription-status.enum";

export async function findAllActivityTypes() {
  return await prisma.activityType.findMany();
}

async function findAll(where: any, userId: string, orderBy?: any){
  const activities = await prisma.activity.findMany({    
    where: {
      ...where,
      deletedAt: null,
      completedAt: null
    },
    orderBy,
    include: {
      ...defaultActivityInclude,
      participants: true
    },
    omit: defaultActivityOmit
  });

  return activities
    .map(activity => ({
      ...activity,
      type: activity.type.name,
      participantCount: activity.participants.length
    }))
    .map(({participants, confirmationCode, ...rest}) => {
      if(rest.creator.id != userId){
        return {
          ...rest, 
          userSubscriptionStatus: userSubscriptionStatus(participants, userId)
        }
      }else{
        return {
          ...rest, 
          confirmationCode
        }
      }
    })
}

async function findAllPaginated(where: any, page: Page, userId: string, orderBy?: any){
  const take = page.pageSize;
  const skip = (page.page - 1) * take;

  const [totalActivities, activities] = await prisma.$transaction([
    prisma.activity.count({ where }),
    prisma.activity.findMany({
      take,
      skip,
      where,
      orderBy,
      include: defaultActivityInclude,
      omit: defaultActivityOmit
    }),
  ]);

  return {
    page: page.page,
    pageSize: take,
    totalActivities,
    totalPages:  Math.ceil(totalActivities / take),
    previous: page.page > 1 ? page.page - 1 : null,
    next: skip + take < totalActivities ? page.page + 1 : null,
    activities: activities.map(activity => ({
      ...activity,
      type: activity.type.name,
      participantCount: activity.participants.length
    }))
    .map(({participants, confirmationCode, ...rest}) => {
      if(rest.creator.id != userId){
        return {
          ...rest, 
          userSubscriptionStatus: userSubscriptionStatus(participants, userId)
        }
      }else{
        return {
          ...rest, 
          confirmationCode
        }
      }
    }),
  };
}

export async function findAllActivities(filter: ActivityQueryFilter, userId: string) {
  const where: any = {
    deletedAt: null,
    completedAt: null,
    creatorId: { not: userId },
  };
  
  if (filter.typeId) {
    where.typeId = filter.typeId;
  }

  const orderBy = (filter.order && filter.orderBy)
    ? { [filter.orderBy]: filter.order, }
    : undefined 

  let activities = await prisma.activity.findMany({    
    where,
    orderBy,
    include: {
      ...defaultActivityInclude,
      participants: true
    },
    omit: defaultActivityOmit
  });
  

  if(!filter.typeId){
    activities = await getSortedActivitiesByPreferences(activities, userId)
  }

  return activities
          .map(activity => ({
            ...activity,
            type: activity.type.name,
            participantCount: activity.participants.length
          }))
          .map(({participants, confirmationCode, ...rest}) => {
            if(rest.creator.id != userId){
              return {
                ...rest, 
                userSubscriptionStatus: userSubscriptionStatus(participants, userId)
              }
            }else{
              return {
                ...rest, 
                confirmationCode
              }
            }
          })
}

export async function findAllCreatedByUser(userId: string) {
  const where = {
    creatorId: userId
  }

  return await findAll(where, userId)
}

export async function findCreatedByUserPaginated(page: Page, userId: string){
  const where = {
    creatorId: userId,
    deletedAt: null,
  }

  return await findAllPaginated(where, page, userId)
}

export async function findByUserAsParticipant(filter: ActivityQueryFilter, userId: string) {
  const where = {
    participants: {
      some: {
        userId: userId
      }
    }
  }

  return await findAll(where, userId)
}

export async function findByUserAsParticipantPaginated(page: Page, userId: string){
  const where = {
      participants: {
        some: {
          userId: userId
        }
      },
      deletedAt: null,
    }

    return await findAllPaginated(where, page, userId)
}

export async function findAllActivitiesPaginated(filter: ActivityQueryFilter, page: Page, userId: string){
  const take = page.pageSize;
  const skip = (page.page - 1) * take;  

  const where: any = {
    deletedAt: null,
    completedAt: null,
    creatorId: { not: userId },
  };

  if (filter.typeId) {
    where.typeId = filter.typeId;
  }

  const orderBy = (filter.order && filter.orderBy)
    ? { [filter.orderBy]: filter.order, }
    : undefined

  let [totalActivities, activities] = await prisma.$transaction([
    prisma.activity.count({ where }),
    prisma.activity.findMany({
      take,
      skip,
      where,
      orderBy,
      include: defaultActivityInclude,
      omit: defaultActivityOmit
    }),
  ]);

  if(!filter.typeId){
    activities = await getSortedActivitiesByPreferences(activities, userId)
  }

  return {
    page: page.page,
    pageSize: take,
    totalActivities,
    totalPages:  Math.ceil(totalActivities / take),
    previous: page.page > 1 ? page.page - 1 : null,
    next: skip + take < totalActivities ? page.page + 1 : null,
    activities: activities.map(activity => ({
      ...activity,
      type: activity.type.name,
      participantCount: activity.participants.length
    }))
    .map(({participants, confirmationCode, ...rest}) => {
      if(rest.creator.id != userId){
        return {
          ...rest, 
          userSubscriptionStatus: userSubscriptionStatus(participants, userId)
        }
      }else{
        return {
          ...rest, 
          confirmationCode
        }
      }
    }),
  };
}

function userSubscriptionStatus(participants: any, userId: string){
  const participant = participants.find((p: ActivityParticipant) => p.userId === userId);

  let userSubscriptionStatus: UserSubscriptionStatusEnum = UserSubscriptionStatusEnum.NOT_SUBSCRIBED;

  if (participant) {
    userSubscriptionStatus =
      participant.approved === true 
      ? UserSubscriptionStatusEnum.SUBSCRIBED 
      : participant.approved === null 
            ? UserSubscriptionStatusEnum.PENDING 
            : UserSubscriptionStatusEnum.NOT_SUBSCRIBED;
  }

  return userSubscriptionStatus;
}

export async function create(activityToSave: ActivityToSave){
  try{
    const activityResponse = await prisma.activity.create({
      data: {
        title: activityToSave.title,
        description: activityToSave.description,
        typeId: activityToSave.typeId,
        image: activityToSave.image,
        scheduledDate: activityToSave.scheduledDate,
        createdAt: activityToSave.createdAt,
        private: activityToSave.private,
        creatorId: activityToSave.creatorId,
        confirmationCode: activityToSave.confirmationCode
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        type: {
          select: {
            name: true
          }
        },
      },
      omit: {
        confirmationCode: true,
        ...defaultActivityOmit
      }
    });
  
    const addressResponse = await prisma.activityAddress.create({
      data: {
        latitude: activityToSave.address.latitude,
        longitude: activityToSave.address.longitude,
        activityId: activityResponse.id
      },
      omit: {
        activityId: true,
        id: true
      }
    })
  
    return {...activityResponse, address: addressResponse, type: activityResponse.type.name}
    
  }catch (error: any){
    if(error?.code == 'P2003')
      throw({message: "Um ou mais IDs são inválidos.", code: 400})
  }
}

export async function update(data: {updateActivityRequest: UpdateActivityRequest, image: string | undefined}) {
  const { id: activityId, ...updateData } = data.updateActivityRequest
  const [address, activityResponse] = await prisma.$transaction([
    prisma.activityAddress.update({
      where: {
        activityId
      },
      data: {
        latitude: updateData.address?.latitude,
        longitude: updateData.address?.longitude
      },
      omit: {
        id: true,
        activityId: true
      }
    }),
    prisma.activity.update({
      where: {
        id: activityId
      },
      data: {
        title: updateData.title,
        description: updateData.description,
        typeId: updateData.typeId,
        image: data.image,
        scheduledDate: updateData.scheduledDate,
        private: updateData.private,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        type: {
          select: {
            name: true
          }
        },
      },
      omit: {
        confirmationCode: true,
        ...defaultActivityOmit
      }
    })
  ])
   
  return {...activityResponse, address, type: activityResponse.type.name};
}

export async function subscribe(activityId: string, userId: string, approved?: boolean) {
  const subscription = await prisma.activityParticipant.create({
    data: {
      activityId,
      userId,
      approved
    }
  })
  return {
    id: subscription.id,
    subscriptionStatus: subscription.approved === true 
      ? UserSubscriptionStatusEnum.SUBSCRIBED 
      : subscription.approved === null 
            ? UserSubscriptionStatusEnum.PENDING 
            : UserSubscriptionStatusEnum.NOT_SUBSCRIBED,
    confirmedAt: subscription.confirmedAt,
    activityId: subscription.activityId,
    userId: subscription.userId
  }
}

export async function approve(approved: boolean, subscriptionId: string){
  await prisma.activityParticipant.update({
    where: {
      id: subscriptionId
    },
    data: {
      approved
    }
  })
  return approved;
}

export async function conclude(activityId: string, date: Date) {
  return await prisma.activity.update({
    where: {
      id: activityId
    },
    data: {
      completedAt: date
    }
  })
}

export async function checkIn(activityParticipantId: string) {
  return await prisma.activityParticipant.update({
    where: {
      id: activityParticipantId
    },
    data: {
      confirmedAt: new Date()
    }
  })
}

export async function unsubscribe(id: string) {
  return await prisma.activityParticipant.delete({
    where: {
      id
    }
  })
}

export async function deleteActivity(activityId: string) {
  return await prisma.activity.update({
    where: {
      id: activityId
    },
    data: {
      deletedAt: new Date()
    }
  })
}

export async function getActivityWithParticipants(activityId: string){
  return await prisma.activity.findFirst({
    where: {
      id: activityId,
    },
    select: {
      confirmationCode: true,
      completedAt: true,
      creatorId: true,
      creator: {
        select: {
          xp: true,
          level: true,
          id: true
        }
      },
      participants: {
        include: {
          user: true
        }
      },
      private: true
    }
  })
}

async function getSortedActivitiesByPreferences(activities: any[], userId: string){
  const userPreferences = await prisma.preferences.findMany({
    where: {
      userId: userId,
    },
    include: {
      type: true,
    },
  });

  const preferredTypeIds = new Set(userPreferences.map(pref => pref.typeId));

  return activities.sort((a, b) => {
    const aPreferred = preferredTypeIds.has(a.type.id) ? 0 : 1;
    const bPreferred = preferredTypeIds.has(b.type.id) ? 0 : 1;

    return aPreferred - bPreferred;
  });
}

const defaultActivityInclude = {
  creator: {
    select: {
      id: true,
      name: true,
      avatar: true
    }
  },
  type: {
    select: {
      name: true,
      id: true
    }
  },
  address: {
    select: {
      latitude: true,
      longitude: true
    }
  },
  participants: {
    select: {
      userId: true,
      confirmedAt: true
    }
  }
}

const defaultActivityOmit = {
  creatorId: true,
  typeId: true,
  deletedAt: true
}