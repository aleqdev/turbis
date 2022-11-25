import { Reducer } from "redux";
import { DatabaseAuth } from "../interface/database_auth";

export type AuthState = DatabaseAuth | null;

export const initialState: AuthState = null;

const SET = 'auth/SET';
type SET = typeof SET;

export interface SetAction {
  type: SET;
  payload: DatabaseAuth
}

export const reducer: Reducer<AuthState> = (state: AuthState = initialState, action): AuthState => {
  switch (action.type) {
      case SET:
          return {
              ...state,
              ...action.payload
          }
      default:
          return state;
  }
}

export const set = (payload: DatabaseAuth): SetAction => ({
  type: SET,
  payload
});

export default reducer;
