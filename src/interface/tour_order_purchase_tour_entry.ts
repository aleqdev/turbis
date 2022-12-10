import { formatDate } from "../utils/fmt";
import TourOrderTourEntry from "./tour_order_entry";

export class TourOrderPurchaseTourEntry extends TourOrderTourEntry {
  reservations_confirmed: boolean;

  constructor(args: {[Property in keyof TourOrderPurchaseTourEntry]: TourOrderPurchaseTourEntry[Property]}) {
    super(args);
    this.reservations_confirmed = args.reservations_confirmed;
  }

  static formatHeader(entry: TourOrderTourEntry): string {
    let desc = `${entry.tour.hotel?.name} ${entry.tour.hotel?.city?.name}`;
    let descShort = desc.slice(0, 20);
    if (descShort !== desc) {
      descShort += "...";
    }
  
    return `${descShort}, (с ${formatDate(entry.tour.arrival_date)} по ${formatDate(entry.tour.departure_date)})`;
  }

  static formatDetails(entry: TourOrderTourEntry): string {
    return `${entry.people_count} чел. по ${entry.price} руб. = ${entry.people_count * entry.price} руб.`;
  }
};

export default TourOrderPurchaseTourEntry;
