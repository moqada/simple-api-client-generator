/**
 * <%= description %>
 */
<%= name %>(<%= args.map(a => a.key + ': ' + a.flow).join(', ') %>): Promise<{body: <%= responseFlow %>, headers: Object, status: number}> {
  const tpl = uriTemplates('<%= href %>');
  <% if (hrefArgs.length) { %>
  const pathSrc: {[key: string]: string} = {<%= hrefArgs.map(a => a.key + ': ' + a.key).join(', ') %>};
  const path = tpl.fill(name => pathSrc[name]);
  <% } else { %>
  const path = tpl.fill(() => '');
  <% } %>
  let opts = options || {};
  <% if (encType) { %>
  opts = Object.assign(opts, {
    headers: {
      'Content-Type': '<%= encType %>'
    }
  });
  <% } %>
  <% if (request) { %>
  <% if (requestRequired) { %>
  const data = params;
  <% } else { %>
  const data = params || {};
  <% } %>
  assert.deepEqual(
    (() => {
      const result = tv4.validateMultiple(data, <%= JSON.stringify(request) %> );
      return {errors: result.errors, missing: result.missing, valid: result.valid};
    })(),
    {errors: [], missing: [], valid: true}
  );
  opts = Object.assign(opts, {
    <% if (method.toLowerCase() === 'get') { %>
    query: data
    <% } else { %>
    data: data
    <% } %>
  });
  <% } %>
  opts = extend(opts, options);
  return this.<%= method %>(path, opts);
}
