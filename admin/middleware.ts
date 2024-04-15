import { withAuth } from "next-auth/middleware";
import { authPrefix, authRoutes, definedRoutes, publicRoutes } from "./routes";

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;
    // check if user is logged in by the existence of token
    const isLoggedIn = !!req.nextauth.token;
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isApiAuthRoute = nextUrl.pathname.startsWith(authPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAllowed =
      definedRoutes.includes(nextUrl.pathname) ||
      nextUrl.pathname.startsWith("/");

    if (isPublicRoute) {
      return null;
    }

    if (isAuthRoute && isLoggedIn) {
      return Response.redirect(new URL(`/`, nextUrl));
    }

    if (!isLoggedIn && !isAuthRoute && !isApiAuthRoute) {
      return Response.redirect(new URL(`/login`, nextUrl));
    }

    if (isLoggedIn && !isAllowed) {
      return Response.redirect(new URL(`/`, nextUrl));
    }
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized() {
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
