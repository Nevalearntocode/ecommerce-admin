import { withAuth } from "next-auth/middleware";
import { authPrefix, authRoutes, publicRoutes } from "./routes";

export default withAuth(
  function middleware(req) {
    if (req.nextauth.token && req.nextUrl.pathname.startsWith(`/register`)) {
      return Response.redirect(new URL(`/`, req.nextUrl));
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized({ req, token }) {
        const { nextUrl } = req;
        const isAuthRoute = authRoutes.includes(nextUrl.pathname);
        const isApiAuthRoute = nextUrl.pathname.startsWith(authPrefix);
        const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
        if (isPublicRoute) return true;
        if (isAuthRoute) return true;
        if (isApiAuthRoute) return true;
        if (req.method === "GET" && nextUrl.pathname.startsWith(`/api`))
          return true;
        if (token) return true;
        return false;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
