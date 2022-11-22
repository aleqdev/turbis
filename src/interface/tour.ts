export interface Tour {
    id: number,
    hotel_id: string,
    country_id: number
}

export interface TourJoinedFetch extends Tour {
    hotel_name: string
}
