import { inngest } from "@/inngest/client";
import { createProject, createMessage, getAllProjects } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    return await getAllProjects()
  }),

  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(10000, { message: "Value is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      const projectName = generateSlug(2, { format: "kebab" });
      const createdProject = await createProject(projectName);
      
      await createMessage(createdProject._id!.toString(), input.value, "USER", "RESULT");

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject._id!.toString(),
        },
      });
      
      return createdProject;
    }),
});
