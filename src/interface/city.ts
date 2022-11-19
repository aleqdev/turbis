export interface City {
    id: number,
    name: string,
    region_id: number
}

export interface CityJoinedFetch extends City {
    region_name: string,
    country_id: number,
    country_name: string
}
