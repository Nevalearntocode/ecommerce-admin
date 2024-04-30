import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { apiAuthPrefix, authRoutes } from "./routes";
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedin = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isUploadthingRoute = nextUrl.pathname.startsWith(`/api/uploadthing`);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isUploadthingRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedin) {
      return Response.redirect(new URL(`/`, nextUrl));
    }
    return;
  }

  if (!isLoggedin && !isUploadthingRoute) {
    return Response.redirect(new URL(`/login`, nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
