import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        userName: user.username,
        profileImageUrl: user.profileImageUrl,
    }
}

export const usersRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        // const users = await ctx.prisma.user.findMany();
        const users = (await clerkClient.users.getUserList())
            .map(filterUserForClient);

        return users;
    }),
    getThisUser: privateProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.currentUserId
            if (!userId) { throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to do that." }) }

            const thisUserReturn = await ctx.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (!thisUserReturn) {
                // this person is logged in but isn't in the database
                // so we need to create them
                return await ctx.prisma.user.create({
                    data: {
                        id: userId,
                        userName: userId
                    }
                })
            }
            console.log(`backend getThisUser: ${JSON.stringify(thisUserReturn)}`)
            return thisUserReturn;

        }),
    createUser: publicProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.currentUserId
        if (!userId) { throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to do that." }) }
        const createdUser = ctx.prisma.user.create({
            data: {
                id: userId,
                userName: userId
            }
        })
        return createdUser
    }),
    getAccounts: privateProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.currentUserId
            console.log(`user: ${JSON.stringify(userId)}`)
            if (!userId) { throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to do that." }) }

            const accounts = await ctx.prisma.account.findMany({
                where: {
                    userId: userId,
                },
            });
            return accounts
        }),
    createAccount: privateProcedure
        .input(z.object({
            name: z.string(),
            accountIndex: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.currentUserId
            if (!userId) { throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to do that." }) }

            const account = await ctx.prisma.account.create({
                data: {
                    userId: userId,
                    name: input.name,
                    accountIndex: input.accountIndex,
                }
            });
            return account
        })
})
