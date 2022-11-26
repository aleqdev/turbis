import { AnyAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import Employee from "../interface/employee";
import API from "../utils/server";
import { RootState } from "./store";

export type EmployeesState = {
  status: "loading"
} | {
  status: "ok",
  data: Array<Employee>
} | {
  status: "err",
  error: any
}

export const initialState: EmployeesState = { status: "loading" };

const SET = 'employees/SET';
type SET = typeof SET;

const PANIC = 'employees/PANIC';
type PANIC = typeof PANIC;

export interface SetAction {
  type: SET,
  payload: Array<Employee>
}

export interface PanicAction {
  type: PANIC,
  error: any
}

export const reducer: Reducer<EmployeesState> = (state: EmployeesState = initialState, action): EmployeesState => {
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

export const set = (payload: Array<Employee>): SetAction => ({
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
      const success = await API.get_with_auth(auth, "employee?select=*,person(*),role:employee_role(*)");
      onSuccess(success);
    } catch (error) {
      onError(error);
    }
  }
};

export default reducer;
