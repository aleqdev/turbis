import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import TourFeedingType from "../interface/tour_feeding_type";
import API from "../utils/server";
import { RootState } from "./store";

export type TourFeedingTypesState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<TourFeedingType>
} | {
  status: "err",
  error: any
}

export const initialState: TourFeedingTypesState = { status: "loading" };

const SET = 'tour_feeding_types/SET';
type SET = typeof SET;

const PANIC = 'tour_feeding_types/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<TourFeedingType>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<TourFeedingTypesState> = (state: TourFeedingTypesState = initialState, action): TourFeedingTypesState => {
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

export const set = (payload: Array<TourFeedingType>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "tour_feeding_type");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
