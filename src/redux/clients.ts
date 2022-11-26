import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import API from "../utils/server";
import { RootState } from "./store";
import Client from "../interface/client";

export type ClientsState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<Client>
} | {
  status: "err",
  error: any
}

export const initialState: ClientsState = { status: "loading" };

const SET = 'clients/SET';
type SET = typeof SET;

const PANIC = 'clients/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<Client>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<ClientsState> = (state: ClientsState = initialState, action): ClientsState => {
  switch (action.type) {
    case SET:
      return {
        status: "ok",
        data: action.payload
      };

    case PANIC:
      return {
        status: "err",
        error: action.error
      }

    default:
      return state;
  }
}

export const set = (payload: Array<Client>): SetAction => ({
  type: SET,
  payload
});

export const panic = (error: any): PanicAction => ({
  type: PANIC,
  error
});

export const fetch = (auth: DatabaseAuth): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch: any) => {
    function onSuccess(payload: any) {
      dispatch(set(payload.data));
    }
    function onError(error: any) {
      dispatch(panic(error));
    }
    try {
      const success = await API.get_with_auth(auth, "client?select=*,person(*),type:client_type(*)");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
