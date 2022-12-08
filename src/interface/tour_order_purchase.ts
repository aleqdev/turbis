import TourOrder from "./tour_order";

export class TourOrderPurchase {
  id: number;
  tour_order_id: number;
  reservations_confirmed: boolean;
  order?: TourOrder;

  constructor(args: {[Property in keyof TourOrderPurchase]: TourOrderPurchase[Property]}) {
    this.id = args.id;
    this.tour_order_id = args.tour_order_id;
    this.reservations_confirmed = args.reservations_confirmed;
    this.order = args.order;
  }
}

export default TourOrderPurchase;
