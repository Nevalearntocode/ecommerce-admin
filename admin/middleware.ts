import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { apiAuthPrefix, authRoutes } from "./routes";
import { NextResponse } from "next/server";
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedin = !!req.auth;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("storeUrl", req.url);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isUploadthingRoute = nextUrl.pathname.startsWith(`/api/uploadthing`);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isUploadthingRoute) {
    return;
  }

  if (req.method === "GET" && nextUrl.pathname.startsWith(`/api`)) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedin) {
      return NextResponse.redirect(new URL(`/`, req.url));
    }
    return;
  }

  if (!isLoggedin && !isUploadthingRoute) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
