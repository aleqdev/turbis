import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import Person from "../interface/person";
import API from "../utils/server";
import { RootState } from "./store";

export type PersonsState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<Person>
} | {
  status: "err",
  error: any
}

export const initialState: PersonsState = { status: "loading" };

const SET = 'persons/SET';
type SET = typeof SET;

const PANIC = 'persons/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<Person>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<PersonsState> = (state: PersonsState = initialState, action): PersonsState => {
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

export const set = (payload: Array<Person>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "person");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
