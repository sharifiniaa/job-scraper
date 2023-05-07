const url = require('url');

export function parsPath(jobUrl: string) {
  const pathName = validateURL(jobUrl) ? url?.parse(jobUrl)?.pathname : '';
  return pathName.split('/').pop();
}

export function validateURL(url: string) {
  let valid = true;
  try {
    new URL(url);
  } catch (error) {
    valid = false;
  } finally {
    return valid;
  }
}
