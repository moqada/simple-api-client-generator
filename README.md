# simple-api-client-generator

[![Greenkeeper badge](https://badges.greenkeeper.io/moqada/simple-api-client-generator.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![DevDependency Status][daviddm-dev-image]][daviddm-dev-url]
[![License][license-image]][license-url]

> API Client Generator from JSON Hyper Schema.

API Client has generated with [Flow](https://github.com/facebook/flow) types for Request, Response, and Resource.
And request parameters is validated with [tv4](https://github.com/geraintluff/tv4) and [power-assert](https://github.com/power-assert-js/power-assert) on development phase.

***WIP***

## Installation

```
npm install --save @moqada/simple-api-client-generator
```


## Usage

```
Usage: simple-api-client-generator [options] <JSON Schema>

Options:
  -n, --name    API Client class name  [string] [default: "APIClient"]
  -o, --output  output file path  [string]
  -a, --assert  assert library name  [string] [default: "power-assert"]
  -l, --lang    output language  [choices: "javascript", "typescript"] [default: "javascript"]
  --help        Show help  [boolean]
  --version     Show version number  [boolean]

Examples:
  simple-api-client-generator ./shema.json                      Output API Client.
  simple-api-client-generator -n AwesomeAPIClient ./shema.json  Output API Client given name
```

Output Example is [here](./example/APIClient.js) from [Sample JSON Hyper Schema](./example/schema.json);

## Restriction

### Depenencies 

Generated Client depends on following modules.

- [@moqada/simple-api-client](https://github.com/moqada/simple-api-client)
- [extend](https://github.com/justmoon/node-extend)
- [power-assert](https://github.com/power-assert-js/power-assert)
- [tv4](https://github.com/geraintluff/tv4)
- [unassert](https://github.com/twada/unassert)
  - [babel-plugin-unassert](https://github.com/twada/babel-plugin-unassert)
- [uri-templates](https://github.com/geraintluff/uri-templates)

### JSON Hyper Schema

**JSON Hyper Schema must have unique `rel` value per resources.**

[npm-url]: https://www.npmjs.com/package/@moqada/simple-api-client-generator
[npm-image]: https://img.shields.io/npm/v/@moqada/simple-api-client-generator.svg?style=flat-square
[travis-url]: https://travis-ci.org/moqada/simple-api-client-generator
[travis-image]: https://img.shields.io/travis/moqada/simple-api-client-generator.svg?style=flat-square
[daviddm-url]: https://david-dm.org/moqada/simple-api-client-generator
[daviddm-image]: https://img.shields.io/david/moqada/simple-api-client-generator.svg?style=flat-square
[daviddm-dev-url]: https://david-dm.org/moqada/simple-api-client-generator#info=devDependencies
[daviddm-dev-image]: https://img.shields.io/david/dev/moqada/simple-api-client-generator.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/github/license/moqada/simple-api-client-generator.svg?style=flat-square
