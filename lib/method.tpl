/**
 * <%= description %>
 */
<%= name %>(<%= args.map(a => a.key + ': ' + a.flow).join(', ') %>): Promise<{body: <%= responseFlow %>, headers: Object, status: number}> {
  const tpl = uriTemplates('<%= href %>');
  const path = tpl.fill({<%= hrefArgs.map(a => a.key + ': ' + a.key).join(', ') %>});
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
    tv4.validateMultiple(data, <%= JSON.stringify(request) %> ),
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
