import Hotel from "./hotel"
import TourFeedingType from "./tour_feeding_type"

export type Tour = {
    id: number,
    hotel_id: number,
    arrival_date: Date,
    departure_date: Date,
    feeding_type_id: number,
    cost: number,
    description: string,
    hotel?: Hotel,
    feeding_type?: TourFeedingType,
}

export default Tour;
