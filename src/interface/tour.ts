import { formatDateDiff } from "../utils/fmt";
import Hotel from "./hotel"
import TourFeedingType from "./tour_feeding_type"
import TourOrder from "./tour_order";
import TourOrderPurchase from "./tour_order_purchase";

export class Tour {
    id: number;
    hotel_id: number;
    arrival_date: Date;
    departure_date: Date;
    feeding_type_id: number;
    price: number;
    description: string;
    hotel?: Hotel;
    feeding_type?: TourFeedingType;
    ordered?: TourOrder[];
    selled?: TourOrderPurchase[];

    constructor(args: {[Property in keyof Tour]: Tour[Property]}) {
        this.id = args.id;
        this.hotel_id = args.hotel_id;
        this.arrival_date = args.arrival_date;
        this.departure_date = args.departure_date;
        this.feeding_type_id = args.feeding_type_id;
        this.price = args.price;
        this.description = args.description;
        this.hotel = args.hotel;
        this.feeding_type = args.feeding_type;
    }

    static format(tour: Tour): string {
        return `${Hotel.format(tour.hotel!)} (${tour.price} руб., ${formatDateDiff(tour.arrival_date, tour.departure_date)} д/н)`;
    }
}

export default Tour;
