import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      username: string;      // 👈 REQUIRED EVERYWHERE
      email?: string | null;
      image?: string | null;
    };
  }
}
