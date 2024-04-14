import { User } from "@prisma/client";

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};
