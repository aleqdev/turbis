import Client from "./client"
import Tour from "./tour";
import TourOrderPaymentType from "./tour_order_payment_type";

export type TourOrder = {
  id: number, 
  client_id: number,
  payment_type_id: number,
  tour_id: number,
  price: number,
  people_count: number,
  group_id: number,
  cost?: number,
  client?: Client,
  payment_type?: TourOrderPaymentType,
  tour?: Tour
}

export default TourOrder;
