import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import API from "../utils/server";
import { RootState } from "./store";
import ClientType from "../interface/client_type";

export type ClientTypesState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<ClientType>
} | {
  status: "err",
  error: any
}

export const initialState: ClientTypesState = { status: "loading" };

const SET = 'client_types/SET';
type SET = typeof SET;

const PANIC = 'client_types/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<ClientType>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<ClientTypesState> = (state: ClientTypesState = initialState, action): ClientTypesState => {
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

export const set = (payload: Array<ClientType>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "client_type");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
