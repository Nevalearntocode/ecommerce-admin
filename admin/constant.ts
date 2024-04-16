// export const redirectRefresh = window.location.assign.bind(window.location);
export const generateSlug = (data: { slug: string; name: string }) => {
  return data.slug !== ""
    ? data.slug
    : data.name.toLowerCase().trim().replace(/\s+/g, "-");
};

export const UNAUTHORIZED_ERROR = {
  message: "You do not have permission to perform this action.",
  statusCode: 403,
};
