export type City = {
    id: number,
    name: string,
    region_id: number
}

export type CityJoinedFetch = City & {
    region_name: string,
    country_id: number,
    country_name: string
}
