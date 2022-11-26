import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import City from "../interface/city";
import { DatabaseAuth } from "../interface/database_auth";
import API from "../utils/server";
import { RootState } from "./store";

export type CitiesState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<City>
} | {
  status: "err",
  error: any
}

export const initialState: CitiesState = { status: "loading" };

const SET = 'cities/SET';
type SET = typeof SET;

const PANIC = 'cities/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<City>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<CitiesState> = (state: CitiesState = initialState, action): CitiesState => {
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

export const set = (payload: Array<City>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "city?select=*,region(*,country(*))");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
