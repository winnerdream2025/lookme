import { prisma } from "@lookme/database";
import { addHours } from "@lookme/utils";

interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: "WORKER" | "CLIENT" | "ADMIN";
  firstName?: string;
  lastName?: string;
  termsAcceptedAt?: Date;
  gender?: "MALE" | "FEMALE";
}

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async createUser(input: CreateUserInput) {
    return prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
        ...(input.termsAcceptedAt ? { termsAcceptedAt: input.termsAcceptedAt } : {}),
        profile: {
          create: {
            firstName: input.firstName,
            lastName: input.lastName,
            ...(input.gender ? { gender: input.gender } : {}),
          },
        },
        wallet: {
          create: {},
        },
        trustScore: input.role === "WORKER" ? { create: {} } : undefined,
      },
    });
  }

  async createSession(userId: string, refreshToken: string) {
    return prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: addHours(new Date(), 168), // 7 days
      },
    });
  }

  async findSession(refreshToken: string) {
    return prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
  }

  async deleteSession(id: string) {
    return prisma.session.delete({ where: { id } });
  }

  async deleteUserSessions(userId: string) {
    return prisma.session.deleteMany({ where: { userId } });
  }
}
