import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

export type User = z.infer<typeof UserSchema>;
