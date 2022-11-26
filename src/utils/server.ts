import axios, { AxiosResponse, AxiosStatic } from "axios";
import { configure, makeUseAxios, UseAxiosResult } from "axios-hooks";
import { DatabaseAuth } from "../interface/database_auth";
import { atLocation } from "./server_url";

const dtrx2 = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;

const parseDates = function(obj: any) {
  // iterate properties
  for(const pName in obj){

    // make sure the property is 'truthy'
    if (obj[pName]){
      var value = obj[pName];

      // determine if the property is an array
      if (Array.isArray(value)){
        for(var ii = 0; ii < value.length; ii++){
          parseDates(value[ii]);
        }
      }
      // determine if the property is an object
      else if (typeof(value) == "object"){
        parseDates(value);
      }
      // determine if the property is a string containing a date
      else if (typeof(value) == "string" && dtrx2.test(value)){
        // parse and replace
        obj[pName] = new Date(obj[pName]);
      }
    }
  }

  return obj;
}

export const instance = axios.create();

instance.interceptors.response.use((response) => {
  response.data = parseDates(response.data);
  return response
});

const useAxios = makeUseAxios({ cache: false, axios: instance, defaultOptions: {} });

export function get(
    path: string,
    json?: object | undefined,
    headers?: any
): ReturnType<typeof axios.get> {
  return instance.get(atLocation(path), {
    data: json ?? {},
    headers: headers
  })
}

export function post(
  path: string,
  json?: object | undefined,
  headers?: any
): ReturnType<typeof axios.post> {
  return instance.post(atLocation(path),
    json ?? {},
    {
      headers: headers
    }
  )
}

export function del(
  path: string,
  json?: object | undefined,
  headers?: any
): ReturnType<typeof axios.delete> {
  return instance.delete(atLocation(path), {
    data: json ?? {},
    headers: headers
  })
}

export function patch(
  path: string,
  json?: object | undefined,
  headers?: any
): ReturnType<typeof axios.patch> {
  return instance.patch(atLocation(path),
    json ?? {},
    {
      headers: headers
    }
  )
}

export function get_with_auth(
  auth: DatabaseAuth,
  path: string,
  json?: object | undefined,
): ReturnType<typeof get> {
  return instance.get(atLocation(path), {
    data: json ?? {},
    headers: {
      "DB-User-Email": auth.email,
      "DB-User-Password": auth.password
    }
  })
}

export function post_with_auth(
  auth: DatabaseAuth,
  path: string,
  json?: object | undefined,
): ReturnType<typeof post> {
  return instance.post(atLocation(path),
    json ?? {},
    {
      headers: {
        "DB-User-Email": auth.email,
        "DB-User-Password": auth.password
      }
    }
  )
}

export function del_with_auth(
  auth: DatabaseAuth,
  path: string,
  json?: object | undefined,
): ReturnType<typeof del> {
  return instance.delete(atLocation(path), {
    data: json ?? {},
    headers: {
      "DB-User-Email": auth.email,
      "DB-User-Password": auth.password
    }
  })
}

export function patch_with_auth(
  auth: DatabaseAuth,
  path: string,
  json?: object | undefined,
): ReturnType<typeof patch> {
  return instance.patch(atLocation(path),
    json ?? {},
    {
      headers: {
        "DB-User-Email": auth.email,
        "DB-User-Password": auth.password
      }
    }
  )
}

/* Лучше использовать redux
export function use_hook<T = any, D = any>(
  auth: DatabaseAuth,
  path: string,
  json?: object | undefined,
): UseAxiosResult<T, object, D> {
  return useAxios({
    url: atLocation(path),
    headers: {
      "DB-User-Email": auth.email,
      "DB-User-Password": auth.password
    },
    data: json ?? {},
  })
}
*/

const API = {
  get: get,
  post: post,
  delete: del,
  patch: patch,
  get_with_auth: get_with_auth,
  post_with_auth: post_with_auth,
  delete_with_auth: del_with_auth,
  patch_with_auth: patch_with_auth,
  //use_hook: use_hook
};

export default API;
