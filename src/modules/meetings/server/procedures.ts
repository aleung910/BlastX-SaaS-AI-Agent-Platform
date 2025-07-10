import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/contants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
    generateToken: protectedProcedure.mutation(async({ctx})=>{
        await streamVideo.upsertUsers([
                {
                    id:ctx.auth.user.id,
                    name: ctx.auth.user.name,
                    role:"admin",
                    image:
                        ctx.auth.user.image ??
                        generateAvatarUri({seed:ctx.auth.user.name, variant:"initials"}),
                }
            ]);
            const expirationTime = Math.floor(Date.now()/1000) + 3600;
            const issuedAt = Math.floor(Date.now()/1000)-60;
            const token = streamVideo.generateUserToken({
                user_id: ctx.auth.user.id,
                exp: expirationTime,
                validity_in_seconds: issuedAt,
            });
            
            return token;
    }),
 remove: protectedProcedure
        .input(z.object({id:z.string()}))
        .mutation(async ({ ctx, input }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userID, ctx.auth.user.id),
                    )
                )
                .returning();
            if (!removedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                });
            }
            return removedMeeting;
        }),
    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const [updatedMeeting] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userID, ctx.auth.user.id),
                    )
                )
                .returning();
            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                });
            }
            return updatedMeeting;
        }),
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userID: ctx.auth.user.id
                })
                .returning();

            const call = streamVideo.video.call("default",createdMeeting.id);
            await call.create({
                data: {
                    created_by_id : ctx.auth.user.id,
                    custom :{
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name
                    },
                    settings_override:{
                        transcription:{
                            language:"en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on",
                        },
                        recording:{
                            mode: "auto-on",
                            quality:"1080p",
                        }
                    }
                },
            });

            const [exisitingAgent] = await db 
                .select()
                .from(agents)
                .where(eq(agents.id, createdMeeting.agentID));

            if(!exisitingAgent){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                });
            }

            await streamVideo.upsertUsers([
                {
                    id:ctx.auth.user.id,
                    name: ctx.auth.user.name,
                    role: "user",
                    image: generateAvatarUri({
                        seed:exisitingAgent.name,
                        variant: "botttsNeutral",
                    }),
                },
            ]);
            
            return createdMeeting;
        }),
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [exisitingMeeting] = await db
            .select({
                ...getTableColumns(meetings),
                agent: agents,
                duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
            })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentID, agents.id))
            .where(and
                (eq(meetings.id, input.id),
                    eq(meetings.userID, ctx.auth.user.id),
                )
            );

        if (!exisitingMeeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
        }
        return exisitingMeeting;
    }),
    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(DEFAULT_PAGE),
                pageSize: z.number()
                    .min(MIN_PAGE_SIZE)
                    .max(MAX_PAGE_SIZE)
                    .default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish(),
                agentID: z.string().nullish(),
                status: z.enum([
                MeetingStatus.Upcoming,
                MeetingStatus.Active,
                MeetingStatus.Completed,
                MeetingStatus.Processing,
                MeetingStatus.Cancelled,
                ]).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize, status, agentID } = input;
          
            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),

                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentID, agents.id))
                .where(and(
                    eq(meetings.userID, ctx.auth.user.id),
                    search ? ilike(meetings.name, '%${search}%') : undefined,
                    status ? eq(meetings.status, status) : undefined,
                    agentID ? eq(meetings.agentID, agentID) : undefined,
                )
                ).orderBy(desc(meetings.createdAt), desc(meetings.id)).limit(pageSize).offset((page - 1) * pageSize)

            const [total] = await db.select({ count: count() })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentID, agents.id))
            .where(and(eq(meetings.userID, ctx.auth.user.id),
                search ? ilike(meetings.name, '%${search}%') : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentID ? eq(meetings.agentID, agentID) : undefined,
            )
            );

            const totalPages = Math.ceil(total.count / pageSize);
            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
})