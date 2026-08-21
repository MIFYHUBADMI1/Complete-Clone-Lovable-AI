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
      try {
        const projectName = generateSlug(2, { format: "kebab" });
        const createdProject = await createProject(projectName);
        
        await createMessage(createdProject._id!.toString(), input.value, "USER", "RESULT");

        // Send to Inngest without waiting (fire and forget)
        // This prevents timeout issues if Inngest is slow
        inngest.send({
          name: "code-agent/run",
          data: {
            value: input.value,
            projectId: createdProject._id!.toString(),
          },
        }).catch((error) => {
          console.error("Inngest send error (non-blocking):", error);
        });
        
        // Add serialized id for frontend
        return {
          ...createdProject,
          id: createdProject._id!.toString(),
        };
      } catch (error) {
        console.error("Project creation error:", error);
        throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
});
