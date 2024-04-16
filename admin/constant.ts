export const redirectRefresh = window.location.assign.bind(window.location);
export const generateSlug = (data: { slug: string; name: string }) => {
  return data.slug !== ""
    ? data.slug
    : data.name.toLowerCase().trim().replace(/\s+/g, "-");
};
