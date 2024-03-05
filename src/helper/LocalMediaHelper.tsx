const getThumbnail = (url: string) => {
  if (url.trim().includes(process.env.PUBLIC_URL || 'localhost') || url.trim().toLowerCase().includes('mentonegirls.vic.edu.au')) {
    return `${url}?thumb=1`;
  }

  return url;
}

const LocalMediaHelper = {
  getThumbnail,
}

export default LocalMediaHelper
