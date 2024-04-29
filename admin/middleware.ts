import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/:path",
    "/:path/settings",
    "/:path/staffs",
    "/:path/billboards",
    "/:path/billboards/:path",
    "/:path/categories",
    "/:path/categories/:path",
    "/:path/products",
    "/:path/products/:path",
    "/:path/orders",
    "/:path/sizes",
    "/:path/sizes/:path",
    "/:path/colors",
    "/:path/colors/:path",
    "/:path/models",
    "/:path/models/:path",
    "/:path/types",
    "/:path/types/:path",
  ],
};
