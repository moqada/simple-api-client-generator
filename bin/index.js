#!/usr/bin/env node
const fs = require('fs');
const updateNotifier = require('update-notifier');
const yargs = require('yargs');
const generate = require('../lib');

const pkg = require('../package.json');

updateNotifier({pkg}).notify();

const argv = yargs
  .usage('Usage: simple-api-client-generator [options] <JSON Schema>')
  .example('simple-api-client-generator ./shema.json', 'Output API Client.')
  .example(
    'simple-api-client-generator -n AwesomeAPIClient ./shema.json',
    'Output API Client given name'
  )
  .option('n', {
    alias: 'name',
    'default': 'APIClient',
    description: 'API Client class name',
    type: 'string'
  })
  .option('o', {
    alias: 'output',
    description: 'output file path',
    type: 'string'
  })
  .option('a', {
    alias: 'assert',
    'default': 'power-assert',
    description: 'assert library name',
    type: 'string'
  })
  .option('l', {
    alias: 'lang',
    choices: ['javascript', 'typescript'],
    'default': 'javascript',
    description: 'output language'
  })
  .help('help')
  .demand(1)
  .version(pkg.version)
  .detectLocale(false)
  .wrap(null)
  .strict().argv;

/**
 * execute
 *
 * @param {Object} args yargs object
 * @return {Promise<string>}
 */
function execute(args) {
  const filepath = args._[0];
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, {encoding: 'utf8'}, (err, res) => {
      if (err) {
        reject(err);
      } else {
        const schema = JSON.parse(res);
        generate(schema, {
          assert: args.assert,
          lang: args.lang,
          name: args.name
        }).then(code => {
          if (!args.output) {
            process.stdout.write(code);
            return resolve(code);
          }
          return fs.writeFile(args.output, code, {encoding: 'utf8'}, e => {
            if (e) {
              return reject(e);
            }
            return resolve(code);
          });
        });
      }
    });
  });
}

execute(argv).catch(err => {
  console.error(err);
  process.exit(1);
});
