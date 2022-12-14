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

export const fetch = (auth: DatabaseAuth, date_begin?: Date, date_end?: Date): ThunkAction<Promise<PromiseSettledResult<void>[] | undefined>, unknown, unknown, AnyAction> => {
  if (auth === undefined) {
    throw new Error(`\`auth\` in dispatched fetch of \`tour_order_turnover\` is \`undefined\``);
  }

  date_begin ??= new Date(0);
  date_end ??= new Date(8640000000000000);
  const date_begin_str = date_begin.toISOString();
  const date_end_str = date_end.toISOString();

  return async (dispatch: any) => {
    function setEntries(payload: any) {
      const tours: Tour[] = payload.data;
      const entries = tours.map(tour => new TourOrderTurnoverEntry({
        tour_id: tour.id,
        ordered: (tour.ordered ?? []).reduce((value, el) => { return value + el.people_count }, 0),
        selled: (tour.selled ?? []).reduce((value, el) => { return value + el.people_count }, 0),
        tour: tour
      }));
      dispatch(set_entries(entries));
    }
    function setTotalMoneyReceived(payload: any) {
      const totalMoneyReceived: number = payload.data[0].sum ?? 0;
      dispatch(set_total_money_received(totalMoneyReceived));
    }
    function onError(error: any) {
      dispatch(panic(error));
    }
    try {
      const fetchEntries = API.get_with_auth(auth, `tour?select=*,ordered:tour_order(*),selled:tour_order_purchase(people_count),hotel(*,city(*,region(*,country(*)))),feeding_type:tour_feeding_type(*)&ordered.crt_date=gte.${date_begin_str}&ordered.crt_date=lte.${date_end_str}&selled.crt_date=gte.${date_begin_str}&selled.crt_date=lte.${date_end_str}`).then(setEntries);
      const fetchTotalMoneyReceived = API.get_with_auth(auth, "tour_order_payment_total_money_received").then(setTotalMoneyReceived);

      return await Promise.allSettled([fetchEntries, fetchTotalMoneyReceived]);
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
