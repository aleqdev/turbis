import Tour from "./tour";

export class TourOrderPayment {
  id: number;
  tour_order_id: number;
  money_received: number;
  order?: Tour;

  constructor(args: {[Property in keyof TourOrderPayment]: TourOrderPayment[Property]}) {
    this.id = args.id;
    this.tour_order_id = args.tour_order_id;
    this.money_received = args.money_received;
    this.order = args.order;
  }
}

export default TourOrderPayment;
