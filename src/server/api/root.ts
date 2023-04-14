
import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { parksRouter } from "./routers/parks";
import { accountsRouter } from "./routers/accounts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  parks: parksRouter,
  accounts: accountsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
