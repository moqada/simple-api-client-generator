<% if (lang !== 'typescript' ) { %>
/* @flow */
<% } %>
/* eslint-disable */
import extend from 'extend';
import assert from '<%= assert %>';
import tv4 from 'tv4';
import uriTemplates from 'uri-templates';
import SimpleAPIClient from '@moqada/simple-api-client';
<% if (lang === 'typescript' ) { %>
import {APIOption} from '@moqada/simple-api-client';
<% } else { %>
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
