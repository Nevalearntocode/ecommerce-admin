import { RouteType } from "./app/(root)/_components/main-nav";

export const generateSlug = (data: { slug: string; name: string }) => {
  return data.slug !== ""
    ? data.slug
    : data.name.toLowerCase().trim().replace(/\s+/g, "-");
};
