/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { env } from "../../../../src/env/server.mjs";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: "v4",
});

export const commentRouter = createTRPCRouter({
  getComments: publicProcedure
    .input(z.object({ tweetId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          tweetId: input.tweetId,
        },
        select: {
          _count: {
            select: {
              likeComment: true,
            },
          },
          likeComment: true,
          text: true,
          user:true,
          id: true,
          createdAt: true,
        },
      });
      return comments;
    }),
  likeComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;
      return await prisma.likeComment.create({
        data: {
          comment: {
            connect: {
              id: input.commentId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  unlikeComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;
      return await prisma.likeComment.delete({
        where: {
          commentId_userId: {
            commentId: input.commentId,
            userId,
          },
        },
      });
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new Error("You must be logged in");
      }
      const { prisma } = ctx;
      const { commentId } = input;

      return await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    }),
});
