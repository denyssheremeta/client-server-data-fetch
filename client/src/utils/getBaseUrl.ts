export const getBaseUrl = (): string => {
  return import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_DEPLOYED;
};
