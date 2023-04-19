const url = require('url');

export function parsPath(jobUrl: string) {
  const pathName = url.parse(jobUrl).pathname;
  return pathName.split('/').pop();
}
