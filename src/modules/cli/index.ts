import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

type TCli = {
  locations: string[];
  keyword: string;
  d: boolean;
};

export async function cli(): Promise<TCli | undefined> {
  try {
    const argv = await yargs(hideBin(process.argv))
      .option('locations', {
        type: 'array',
        description: 'List of locations',
        demandOption: true,
        coerce: arg => (typeof arg === 'string' ? [arg] : arg),
      })
      .option('keyword', {
        type: 'string',
        description: 'Keyword for searching',
        demandOption: true,
        coerce: arg => arg,
      })
      .option('d', {
        type: 'boolean',
        description: 'Get Description or not? (default is False)',
        default: false,
      }).argv;

    return {
      locations: argv.locations,
      keyword: argv.keyword,
      d: argv.d,
    } as TCli;
  } catch (err) {
    console.log(err);
  }
}
