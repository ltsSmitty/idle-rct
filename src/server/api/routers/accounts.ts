import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const accountsRouter = createTRPCRouter({
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
        .mutation(async ({ ctx, input: { name, accountIndex } }) => {
            const userId = ctx.currentUserId
            if (!userId) { throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to do that." }) }

            return await ctx.prisma.account.create({
                data: {
                    userId,
                    name,
                    accountIndex,
                }
            });
        }),
    deleteAccount: privateProcedure
        .input(z.object({
            id: z.string(),
            index: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.currentUserId
            if (!userId) { throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to do that." }) }

            const accounts = await ctx.prisma.account.deleteMany({
                where: {
                    userId: userId,
                    accountIndex: input.index ?? -1,
                }
            });
            return accounts.count
        }),
})
