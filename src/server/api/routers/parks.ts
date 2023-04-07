import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const parksRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.park.findMany();
    }),
    get: publicProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
        return ctx.prisma.park.findUnique({ where: { id: input.id } });
    }),
});
