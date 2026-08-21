import { inngest } from "@/inngest/client";
import { createProject, createMessage } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { sql } from "@vercel/postgres";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const result = await sql`
      SELECT * FROM "Project" ORDER BY "updatedAt" DESC
    `;
    return result.rows;
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
      
      await createMessage(createdProject.id, input.value, "USER", "RESULT");

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });
      
      return createdProject;
    }),
});
