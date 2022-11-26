import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import Hotel from "../interface/hotel";
import API from "../utils/server";
import { RootState } from "./store";

export type HotelsState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<Hotel>
} | {
  status: "err",
  error: any
}

export const initialState: HotelsState = { status: "loading" };

const SET = 'hotels/SET';
type SET = typeof SET;

const PANIC = 'hotels/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<Hotel>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<HotelsState> = (state: HotelsState = initialState, action): HotelsState => {
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

export const set = (payload: Array<Hotel>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "hotel?select=*,city(*,region(*,country(*))),owner:person(*)");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
