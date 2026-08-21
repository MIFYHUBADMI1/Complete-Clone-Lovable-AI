import { Inngest } from "inngest";

export const inngest = new Inngest({ 
  id: "vibe-development",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
