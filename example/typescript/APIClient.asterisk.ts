
/* eslint-disable */

import * as extend from 'extend';
import * as assert from 'power-assert';
import * as tv4 from 'tv4';
import * as uriTemplates from 'uri-templates';

import {SimpleAPIClient, APIOption} from '@moqada/simple-api-client';

/* Resources */
export type Info = {
  publishedAt?: string,
  id?: number,
  title?: string,
  content?: string
}

export type Machine = {
  id?: string,
  name?: string
}

export type User = {
  id: string,
  firstName: string,
  lastName: string,
  birthday: string,
  tel?: string,
  registeredAt: string,
  addressZip?: string,
  addressState?: string,
  addressCity?: string,
  addressLine1?: string,
  addressLine2?: string,
  gender?: 'na' | 'male' | 'female',
  machine?: {
    id?: string,
    name?: string
  },
  infos?: {
      publishedAt?: string,
      id?: number,
      title?: string,
      content?: string
    }[]
}

/* Links */
export type InfoInstancesResponse = {
  publishedAt?: string,
  id?: number,
  title?: string,
  content?: string
}[]

export type InfoSelfResponse = {
  publishedAt?: string,
  id?: number,
  title?: string,
  content?: string
}

export type UserCreateRequest = {
  firstName: string,
  lastName: string,
  password: string,
  birthday: string,
  gender: 'na' | 'male' | 'female'
}

export type UserCreateResponse = {
  id: string,
  firstName: string,
  lastName: string,
  birthday: string,
  tel?: string,
  registeredAt: string,
  addressZip?: string,
  addressState?: string,
  addressCity?: string,
  addressLine1?: string,
  addressLine2?: string,
  gender?: 'na' | 'male' | 'female',
  machine?: {
    id?: string,
    name?: string
  },
  infos?: {
      publishedAt?: string,
      id?: number,
      title?: string,
      content?: string
    }[]
}

export type UserSelfResponse = {
  id: string,
  firstName: string,
  lastName: string,
  birthday: string,
  tel?: string,
  registeredAt: string,
  addressZip?: string,
  addressState?: string,
  addressCity?: string,
  addressLine1?: string,
  addressLine2?: string,
  gender?: 'na' | 'male' | 'female',
  machine?: {
    id?: string,
    name?: string
  },
  infos?: {
      publishedAt?: string,
      id?: number,
      title?: string,
      content?: string
    }[]
}

type APIResponse = {
  body: any,
  error: any,
  headers: any,
  status: number
};

/**
 * APIClient
 */
export default class APIClient extends SimpleAPIClient<APIResponse> {

  toResponse(error: any, response: any): APIResponse {
    return {
      body: response && response.body,
      error: error,
      headers: response && response.headers,
      status: response && response.status
    };
  }

  /**
   * 
   */
  infoInstances(options?: APIOption): Promise<{body: InfoInstancesResponse, headers: Object, status: number}> {
    const tpl = uriTemplates('/info');
    const path = tpl.fill(() => '');
    let opts = options || {};
    opts = extend(opts, options);
    return this.get(path, opts);
  }

  /**
   * 
   */
  infoSelf(id0: number, options?: APIOption): Promise<{body: InfoSelfResponse, headers: Object, status: number}> {
    const tpl = uriTemplates('/info/{id0}');
    const pathSrc: {[key: string]: string} = {id0: id0.toString()};
    const path = tpl.fill(name => pathSrc[name]);
    let opts = options || {};
    opts = extend(opts, options);
    return this.get(path, opts);
  }

  /**
   * ユーザ登録
   */
  userCreate(params: UserCreateRequest, options?: APIOption): Promise<{body: UserCreateResponse, headers: Object, status: number}> {
    const tpl = uriTemplates('/users');
    const path = tpl.fill(() => '');
    let opts = options || {};
    const data = params;
    assert.deepEqual(
      (() => {
        const result = tv4.validateMultiple(data, {"properties":{"firstName":{"description":"名","readOnly":true,"example":"わかる","type":["string"]},"lastName":{"description":"姓","readOnly":true,"example":"わたり","type":["string"]},"password":{"description":"パスワード","example":"pass","type":["string"]},"birthday":{"description":"生年月日","pattern":"^[0-9]{4}-[0-9]{2}-[0-9]{2}$","example":"1985-04-20","type":["string"]},"gender":{"description":"性別","example":"male","type":["string"],"enum":["na","male","female"]}},"type":["object"],"required":["firstName","lastName","email","password","birthday","gender"]} );
        return {errors: result.errors, missing: result.missing, valid: result.valid};
      })(),
      {errors: [], missing: [], valid: true}
    );
    opts = Object.assign(opts, {
      data: data
    });
    opts = extend(opts, options);
    return this.post(path, opts);
  }

  /**
   * ログイン中ユーザのアカウント情報
   */
  userSelf(options?: APIOption): Promise<{body: UserSelfResponse, headers: Object, status: number}> {
    const tpl = uriTemplates('/users/me');
    const path = tpl.fill(() => '');
    let opts = options || {};
    opts = extend(opts, options);
    return this.get(path, opts);
  }

}
