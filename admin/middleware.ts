import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { authRoutes, DEFAULT_REDIRECT, authPrefix } from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(authPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
    }
  }
  if (!isLoggedIn && !isAuthRoute && !isApiRoute) {
    return Response.redirect(new URL(`/login`, nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
