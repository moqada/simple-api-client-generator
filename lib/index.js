const fs = require('fs');
const path = require('path');
const $RefParser = require('json-schema-ref-parser');
const lodashTemplate = require('lodash.template');
const uriTemplates = require('uri-templates');

const methodTpl = lodashTemplate(fs.readFileSync(path.join(__dirname, './method.tpl'), {encoding: 'utf8'}));
const clientTpl = lodashTemplate(fs.readFileSync(path.join(__dirname, './client.tpl'), {encoding: 'utf8'}));

/**
 * to CamelCase
 *
 * @param {string} str - target string
 * @param {Object} [options] - options
 * @param {string} [options.sep] - separator
 * @return {string}
 */
function camelize(str, options) {
  const opts = options || {sep: '-'};
  return str
    .split(opts.sep)
    .map(s => `${s[0].toUpperCase()}${s.slice(1)}`)
    .join('');
}

/**
 * JSON Schema to Flowtype
 *
 * @param {Object} schema - JSON Schema object
 * @param {number} depth - nest depth
 * @return {string}
 */
function toFlowtype(schema, depth) {
  // TODO: multiple types
  const d = depth || 1;
  const type = (Array.isArray(schema.type)
    ? schema.type[0]
    : schema.type || 'object'
  ).toLowerCase();
  if (type === 'object') {
    // properties
    const ps = Object.keys(schema.properties).map(k => {
      const s = schema.properties[k];
      const required = (schema.required || []).indexOf(k) > -1;
      const formattedKey = k.indexOf('-') > 1 ? `'${k}'` : k;
      return `${formattedKey}${required ? '' : '?'}: ${toFlowtype(s, d + 1)}`;
    });

    // create properties string
    const psString = `${ps.map(p => `${'  '.repeat(d)}${p}`).join(',\n')}`;

    return `{\n${psString}\n${'  '.repeat(d - 1)}}`;
  } else if (type === 'array') {
    return `${toFlowtype(schema.items, d + 1)}[]`;
  }

  if (schema.enum) {
    return schema.enum.map(e => {
      return typeof e === 'string' ? `'${e}'` : e;
    }).join(' | ');
  }

  return (Array.isArray(schema.type) ? schema.type : [schema.type])
    .map(t => {
      if (t === 'date') {
        return 'Date';
      } else if (t === 'bool') {
        return 'boolean';
      } else if (t === 'integer') {
        return 'number';
      }
      return t;
    })
    .join(' | ');
}

/**
 * Generate API Client from JSON Schema
 *
 * @param {Object} json - JSON Schema
 * @param {Object} [options] - options
 * @param {Object} [options.name] - API Client class name (default. APIClient)
 * @param {Object} [options.lang] - output language name (default. javascript)
 * @param {Object} [options.assert] - assert library name (default. power-assert)
 * @param {Object} [options.importStyle] - TypeScript import style (default. default)
 * @return {Promise<string>}
 */
function generate(json, options) {
  // TODO: too dirty, refactor
  const parser = new $RefParser();
  const opts = options || {};
  opts.name = opts.name || 'APIClient';
  opts.lang = opts.lang || 'javascript';
  opts.assert = opts.assert || 'power-assert';
  opts.importStyle = opts.importStyle || 'default';
  return parser
    .dereference(json)
    .then(schema => {
      const methods = [];
      const linkFlowtypes = [];
      const resourceFlowtypes = [];
      Object.keys(schema.properties)
        .sort()
        .forEach(key => {
          const resource = schema.properties[key];
          resourceFlowtypes.push(`export type ${camelize(key)} = ${toFlowtype(resource)}`);
          if (!resource.links) {
            return undefined;
          }
          resource.links
            .sort((a, b) => {
              if (a.rel > b.rel) {
                return 1;
              } else if (a.rel < b.rel) {
                return -1;
              }
              return 0;
            })
            .forEach(link => {
              const hrefTpl = uriTemplates(link.href);
              let href = link.href;
              const hrefArgs = hrefTpl.varNames.map((n, idx) => {
                return {
                  flow: toFlowtype(parser.$refs.get(decodeURIComponent(n).slice(1, -1))),
                  key: `id${idx}`,
                  orgKey: n,
                  type: 'id'
                };
              });
              hrefArgs.forEach(a => {
                href = href.replace(a.orgKey, a.key);
              });
              let args = hrefArgs;
              const reqFlow = `${camelize(key)}${camelize(link.rel)}Request`;
              const resFlow = `${camelize(key)}${camelize(link.rel)}Response`;
              if (link.schema) {
                args = args.concat([
                  {
                    flow: reqFlow,
                    key: 'params',
                    required: !!link.schema.required,
                    type: 'data'
                  }
                ]);
                linkFlowtypes.push(`export type ${reqFlow} = ${toFlowtype(link.schema)}`);
              }
              args = args.concat([
                {
                  flow: 'APIOption',
                  key: 'options?',
                  type: 'data'
                }
              ]);
              if (link.targetSchema || link.method.toLowerCase() !== 'delete') {
                let resType = `export type ${resFlow} = ${toFlowtype(link.targetSchema || resource)}`;
                if (link.rel.indexOf('instances') > -1 && !link.targetSchema) {
                  resType += '[]';
                }
                linkFlowtypes.push(resType);
              } else {
                linkFlowtypes.push(`export type ${resFlow} = {}`);
              }
              const method = methodTpl({
                args,
                description: link.description,
                encType: link.encType,
                href,
                hrefArgs,
                method: link.method.toLowerCase(),
                name: `${key}${camelize(link.rel)}`,
                request: link.schema,
                requestRequired: !!(link.schema && link.schema.required),
                responseFlow: resFlow
              }).replace(/\n\s*\n/g, '\n');
              methods.push(method);
            });
          return undefined;
        });
      return clientTpl({
        assert: opts.assert,
        importStyle: opts.importStyle,
        lang: opts.lang,
        linkFlowtypes,
        methods,
        name: opts.name,
        resourceFlowtypes
      }).replace(/^\s+$/gm, '');
    })
    .catch(console.error);
}

module.exports = generate;
