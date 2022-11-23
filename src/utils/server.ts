import axios, { AxiosResponse, AxiosStatic } from "axios";
import useAxios, { UseAxiosResult } from "axios-hooks";
import { DatabaseAuth } from "../interface/database_auth";
import { atLocation } from "./server_url";

export function get(
    path: string,
    json?: object | undefined,
    headers?: any
): ReturnType<typeof axios.get> {
  return axios.get(atLocation(path), {
    data: json ?? {},
    headers: headers
  })
}

export function post(
  path: string,
  json?: object | undefined,
  headers?: any
): ReturnType<typeof axios.post> {
  return axios.post(atLocation(path),
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
  return axios.delete(atLocation(path), {
    data: json ?? {},
    headers: headers
  })
}

export function patch(
  path: string,
  json?: object | undefined,
  headers?: any
): ReturnType<typeof axios.patch> {
  return axios.patch(atLocation(path),
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
  return axios.get(atLocation(path), {
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
  return axios.post(atLocation(path),
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
  return axios.delete(atLocation(path), {
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
  return axios.patch(atLocation(path),
    json ?? {},
    {
      headers: {
        "DB-User-Email": auth.email,
        "DB-User-Password": auth.password
      }
    }
  )
}

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
    data: json ?? {}
  })
}

const API = {
  get: get,
  post: post,
  delete: del,
  patch: patch,
  get_with_auth: get_with_auth,
  post_with_auth: post_with_auth,
  delete_with_auth: del_with_auth,
  patch_with_auth: patch_with_auth,
  use_hook: use_hook
};

export default API;
