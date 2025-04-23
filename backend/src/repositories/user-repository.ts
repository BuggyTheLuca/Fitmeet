import prisma from "../configs/prisma-client";
import { AchievementNamesEnum } from "../enums/achievements.enum";
import { NewUserRequest, UpdateUserRequest } from "../types/user-types";

export async function getUserById(id: string){
  return await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      achievements: {
        include: {
          achievement: true
        }
      }
    }
  })
}

export async function getByEmail(email: string){
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      achievements: {
        include: {
          achievement: {
            select: {
              name: true,
              criterion: true
            }
          }
        }
      }
    }
  });

  if (!user) return null;

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    avatar: user.avatar,
    password: user.password,
    xp: user.xp,
    level: user.level,
    deletedAt: user.deletedAt,
    achievements: user.achievements.map(ua => ua.achievement)
  };

  return userResponse;
}

export async function findByEmailOrCpf(email: string, cpf: string){
  return await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { cpf: cpf }
      ]
    }
  })
}

export async function create(data: NewUserRequest) { 
  return await prisma.user.create({
    data
  });
}

export async function findUserPreferences(userId: string) {
  const preferences = await prisma.preferences.findMany({
    where: {
      userId: userId
    },
    select: {
      type: true
    }
  })

  return preferences.map(({type}) => type);
}

export async function updateUserData(id: string, updateUser: UpdateUserRequest){
  return await prisma.user.update({
    where: {
      id: id
    },
    data:{
      email: updateUser.email,
      password: updateUser.password,
      name: updateUser.name
    },
    omit:{
      password: true,
      deletedAt: true
    }
  })
}

export async function updateUserLevel(data: {xp: number, level: number}, userId: string){
  await prisma.user.update({
    where: {
      id: userId
    },
    data
  })
}

export async function deactivateUser(id: string) {
  return await prisma.user.update({
    where: {
      id: id
    },
    data: {
      deletedAt: new Date()
    }
  })
}

export async function defineUserAvatar(id: string, avatar: string) {
    return await prisma.user.update({
      where: {
        id: id
      },
      data: {
        avatar
      }
    })
}

export async function updatePreferences(userId: string, typeIds: string[]) {
  try {
    const currentPreferences = await prisma.preferences.findMany({
      where: { userId },
      select: { typeId: true }
    });
  
    const currentTypeIds = currentPreferences.map(p => p.typeId);
    const toRemove = currentTypeIds.filter(id => !typeIds.includes(id));
    const toAdd = typeIds.filter(id => !currentTypeIds.includes(id));
  
    if (toRemove.length > 0) {
        await prisma.preferences.deleteMany({
            where: {
                userId,
                typeId: { in: toRemove }
            }
        });
    }
  
    if (toAdd.length > 0) {
        await prisma.preferences.createMany({
            data: toAdd.map(typeId => ({ userId, typeId })),
            skipDuplicates: true
        });
    }
  } catch (error: any){
    if(error?.code == 'P2003')
      throw({message: "Um ou mais IDs são inválidos.", code: 400})
  }
}

export async function updateUserAchievements(userId: string, achievementNamesEnum: AchievementNamesEnum) {
  await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: (
        await prisma.achievement.findUnique({
          where: { name: achievementNamesEnum },
          select: { id: true },
        })
      )?.id!,
    },
  });
}