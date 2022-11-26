import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import EmployeeRole from "../interface/employee_role";
import API from "../utils/server";
import { RootState } from "./store";

export type EmployeeRolesState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<EmployeeRole>
} | {
  status: "err",
  error: any
}

export const initialState: EmployeeRolesState = { status: "loading" };

const SET = 'employee_roles/SET';
type SET = typeof SET;

const PANIC = 'employee_roles/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<EmployeeRole>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<EmployeeRolesState> = (state: EmployeeRolesState = initialState, action): EmployeeRolesState => {
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

export const set = (payload: Array<EmployeeRole>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "employee_role");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
