import { User } from "@prisma/client";

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};
