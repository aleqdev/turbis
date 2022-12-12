import { AnyAction, Reducer } from "redux";
import { ThunkAction } from "redux-thunk";
import { DatabaseAuth } from "../interface/database_auth";
import Tour from "../interface/tour";
import TourOrderTurnover, { TourOrderTurnoverEntry } from "../interface/tour_order_turnover";
import API from "../utils/server";

export type TourOrderTurnoverState = {
  status: "loading"
} | {
  status: "ok",
  data: TourOrderTurnover
} | {
  status: "err",
  error: any
};

const SET_ENTRIES = `tour_order_turnover/SET_ENTRIES`;
type SET_ENTRIES = typeof SET_ENTRIES;

const SET_TOTAL_MONEY_RECEIVED = `tour_order_turnover/SET_TOTAL_MONEY_RECEIVED`;
type SET_TOTAL_MONEY_RECEIVED = typeof SET_TOTAL_MONEY_RECEIVED;

const PANIC = `tour_order_turnover/PANIC`;
type PANIC = typeof PANIC;

interface SetEntriesAction<SET_ENTRIES> {
  type: SET_ENTRIES,
  entries: TourOrderTurnoverEntry[]
}

interface SetTotalMoneyReceivedAction<SET_TOTAL_MONEY_RECEIVED> {
  type: SET_TOTAL_MONEY_RECEIVED,
  total_money_received: number
}

interface PanicAction<PANIC> {
  type: PANIC,
  error: any
}

const initialState: TourOrderTurnoverState = { status: "loading" };

export const reducer: Reducer<TourOrderTurnoverState> = (state: TourOrderTurnoverState = initialState, action): TourOrderTurnoverState => {
  switch (action.type) {
    case SET_ENTRIES:
      return {
        status: "ok",
        data: {
          entries: action.entries,
          total_money_received: (state.status === 'ok' ? state.data.total_money_received : 0)
        },
      };

    case SET_TOTAL_MONEY_RECEIVED:
      return {
        status: "ok",
        data: {
          total_money_received: action.total_money_received,
          entries: (state.status === 'ok' ? state.data.entries : [])
        },
      };

    case PANIC:
      return {
        status: "err",
        error: action.error,
      }

    default:
      return state;
  }
}

export const set_entries = (entries: TourOrderTurnoverEntry[]): SetEntriesAction<SET_ENTRIES> => ({
  type: SET_ENTRIES,
  entries
});

export const set_total_money_received = (total_money_received: number): SetTotalMoneyReceivedAction<SET_TOTAL_MONEY_RECEIVED> => ({
  type: SET_TOTAL_MONEY_RECEIVED,
  total_money_received
});

export const panic = (error: any): PanicAction<PANIC> => ({
  type: PANIC,
  error
});

export const fetch = (auth: DatabaseAuth, date_begin?: Date, date_end?: Date): ThunkAction<Promise<TourOrderTurnoverState>, unknown, unknown, AnyAction> => {
  if (auth === undefined) {
    throw new Error(`\`auth\` in dispatched fetch of \`tour_order_turnover\` is \`undefined\``);
  }

  return async (dispatch: any) => {
    function onSuccess(payload: any) {
      const tours: Tour[] = payload.data;
      const entries = tours.map(tour => new TourOrderTurnoverEntry({
        tour_id: tour.id,
        ordered: tour.ordered ?? 0,
        selled: tour.selled ?? 0,
        tour: tour
      }));

      dispatch(set_entries(entries));
      return tours;
    }
    function onError(error: any) {
      dispatch(panic(error));
    }
    try {
      const success: any = await API.get_with_auth(auth, "tour?select=*,ordered:tour_order_turnover_ordered,selled:tour_order_turnover_selled,hotel(*,city(*,region(*,country(*)))),feeding_type:tour_feeding_type(*)", {
        date_begin,
        date_end
      });
      onSuccess(success);
      return success.data;
    } catch (error) {
      onError(error);
    }
  }
};

export const TourOrderTurnoverR = {
  set_entries,
  set_total_money_received,
  fetch,
  panic,
  reducer
}

export default TourOrderTurnoverR;
