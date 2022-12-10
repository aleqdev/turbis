import TourOrder from "./tour_order";

export class TourOrderPurchase extends TourOrder {
  reservations_confirmed: boolean;

  constructor(args: {[Property in keyof TourOrderPurchase]: TourOrderPurchase[Property]}) {
    super(args);
    this.reservations_confirmed = args.reservations_confirmed;
  }
}

export default TourOrderPurchase;
