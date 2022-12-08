import { AnyAction, Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../../interface/database_auth";
import API from "../../utils/server";
import { RootState } from "../store";

export type TableManageable<T> = {
  status: "loading"
} | {
  status: "ok",
  data: T[],
  selected: T[]
} | {
  status: "err",
  error: any
}

export type MakeReducer<T, SET, SELECT, PANIC> = {
  reducer: Reducer<TableManageable<T>>,
  set: (payload: T[]) => SetAction<SET, T>,
  select: (payload: T[]) => SelectAction<SELECT, T>,
  panic: (error: any) => PanicAction<PANIC, T>,
  fetch: (auth: DatabaseAuth) => ThunkAction<void, RootState, unknown, AnyAction>
}

interface SetAction<SET, T> {
  type: SET,
  payload: T[]
}

interface SelectAction<SELECT, T> {
  type: SELECT,
  payload: T[]
}

interface PanicAction<PANIC, T> {
  type: PANIC,
  error: any
}

export function makeReducer<T, name extends string, url extends string>(name: name, url: url): MakeReducer<T, string, string, string> {
  const SET = `${name}/SET`;
  type SET = typeof SET;

  const SELECT = `${name}/SELECT`;
  type SELECT = typeof SELECT;

  const PANIC = `${name}/PANIC`;
  type PANIC = typeof PANIC;
  
  const initialState: TableManageable<T> = { status: "loading" };
  
  function reducerFunction(state: TableManageable<T> = initialState, action: AnyAction): TableManageable<T> {
    switch (action.type) {
      case SET:
        return {
          status: "ok",
          data: action.payload,
          selected: []
        };

      case SELECT:
        if (state.status !== "ok") {
          return state;
        }
        return {
          ...state,
          selected: action.payload
        }

      case PANIC:
        return {
          status: "err",
          error: action.error,
        }
  
      default:
        return state;
    }
  }
  
  const set = (payload: T[]): SetAction<SET, T> => ({
    type: SET,
    payload
  });

  const select = (payload: T[]): SelectAction<SELECT, T> => ({
    type: SELECT,
    payload
  });
  
  const panic = (error: any): PanicAction<PANIC, T> => ({
    type: PANIC,
    error
  });
  
  const fetch = (auth: DatabaseAuth): ThunkAction<void, RootState, unknown, AnyAction> => {
    if (auth === undefined) {
      throw new Error(`\`auth\` in dispatched fetch of \`${name}\` is \`undefined\``);
    }

    return async (dispatch: any) => {
      function onSuccess(payload: any) {
        dispatch(set(payload.data));
      }
      function onError(error: any) {
        dispatch(panic(error));
      }
      try {
        const success = await API.get_with_auth(auth, url);
        onSuccess(success);
      } catch (error) {
        onError(error);
      }
    }
  };
  
  return {
    reducer: reducerFunction,
    set: set,
    panic: panic,
    select: select,
    fetch: fetch
  }
}
