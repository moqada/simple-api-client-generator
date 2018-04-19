<% if (lang !== 'typescript' ) { %>
/* @flow */
<% } %>
/* eslint-disable */
<% if (importStyle === 'default' ) { %>
import extend from 'extend';
import assert from '<%= assert %>';
import tv4 from 'tv4';
import uriTemplates from 'uri-templates';
<% } else { %>
import * as extend from 'extend';
import * as assert from '<%= assert %>';
import * as tv4 from 'tv4';
import * as uriTemplates from 'uri-templates';
<% } %>
<% if (lang === 'typescript' ) { %>
import SimpleAPIClient, {APIOption} from '@moqada/simple-api-client';
<% } else { %>
import SimpleAPIClient from '@moqada/simple-api-client';
import type {APIOption} from '@moqada/simple-api-client';
<% } %>

/* Resources */
<%= resourceFlowtypes.join('\n\n') %>

/* Links */
<%= linkFlowtypes.join('\n\n') %>

type APIResponse = {
  body: any,
  error: any,
  headers: any,
  status: number
};

/**
 * <%= name %>
 */
export default class <%= name %> extends SimpleAPIClient<APIResponse> {

  toResponse(error: any, response: any): APIResponse {
    return {
      body: response && response.body,
      error: error,
      headers: response && response.headers,
      status: response && response.status
    };
  }

<%= methods.map(m => m.split('\n').map(s => '  ' + s).join('\n')).join('\n\n') %>
}
