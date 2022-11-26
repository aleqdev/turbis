import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import Tour from "../interface/tour";
import API from "../utils/server";
import { RootState } from "./store";

export type ToursState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<Tour>
} | {
  status: "err",
  error: any
}

export const initialState: ToursState = { status: "loading" };

const SET = 'tours/SET';
type SET = typeof SET;

const PANIC = 'tours/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<Tour>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<ToursState> = (state: ToursState = initialState, action): ToursState => {
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

export const set = (payload: Array<Tour>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "tour?select=*,hotel(*,city(*,region(*,country(*)))),feeding_type:tour_feeding_type(*)");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
