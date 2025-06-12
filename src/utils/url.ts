const BASE_URL = "/simulados-concursos-expert";

export const getFullUrl = (path: string) => {
  // Remove a barra inicial se existir
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/#/${cleanPath}`;
};

export const getAssetUrl = (path: string) => {
  // Remove a barra inicial se existir
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};
