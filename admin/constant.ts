export const generateSlug = (data: { slug: string; name: string }) => {
  return data.slug !== ""
    ? data.slug
    : data.name.toLowerCase().trim().replace(/\s+/g, "-");
};
