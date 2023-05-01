require('dotenv').config();
const http = require('http');
import {scraper} from './modules/scraper';
import {collectCompanies} from './modules/companies';
import {cli} from './modules/cli';
import {generateCoverLetter} from './modules/telegram';

generateCoverLetter();

export async function runScripts(locations?: string[], keyword?: string, description?: boolean) {
  if (locations && keyword) {
    console.log('we are here');
    await scraper(locations, keyword, description);
    return;
  }
  const userArgs = await cli();
  if (userArgs) {
    await collectCompanies();
    console.log(userArgs);
    await scraper(userArgs.locations, userArgs.keyword, userArgs.d);
  }
}
// void runScripts();

const server = http.createServer((req: any, res: any) => {
  if (req.method === 'GET' && req.url === '/start') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({message: 'Script ran'}));
    res.end();
    void runScripts(['Amsterdam'], 'react', false);
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
