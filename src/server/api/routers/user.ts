import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  changeUserTheme: protectedProcedure
    .input(z.object({ theme: z.enum(["light", "dark"]) }))
    .mutation(({ input: { theme }, ctx }) => {
      return ctx.prisma.user.update({
        data: {
          theme,
        },
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          theme: true,
        },
      });
    }),
  changeUserData: protectedProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        username: z.string().nullish(),
        image: z.string().nullish(),
      })
    )
    .mutation(({ input: { username, name, image }, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name,
          username,
          image,
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    }),
  users: protectedProcedure
    .input(z.object({ user: z.string() }))
    .query(({ input: { user }, ctx }) => {
      return ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: user,
                mode: "insensitive",
              },
              username: {
                contains: user,
                mode: "insensitive",
              },
            },
          ],
          NOT: { id: ctx.session.user.id },
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    }),
});
