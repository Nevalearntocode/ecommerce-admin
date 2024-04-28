import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname.startsWith(`/api/uploadthing`)) return true;
      if (token) return true;
      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
