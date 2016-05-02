/* @flow */
/* eslint-disable */
import extend from 'extend';
import assert from '<%= assert %>';
import tv4 from 'tv4';
import uriTemplates from 'uri-templates';
import SimpleAPIClient from '@moqada/simple-api-client';
import type {APIOption} from '@moqada/simple-api-client';

/* Resources */
<%= resourceFlowtypes.join('\n\n') %>

/* Links */
<%= linkFlowtypes.join('\n\n') %>


/**
 * <%= name %>
 */
export default class <%= name %> extends SimpleAPIClient {

  toResponse(error: ?Object, response: ?Object): Object {
    return {
      body: response && response.body,
      error: error,
      headers: response && response.headers,
      status: response && response.status
    };
  }

<%= methods.map(m => m.split('\n').map(s => '  ' + s).join('\n')).join('\n\n') %>
}
