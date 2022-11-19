export interface Region {
    id: number,
    name: string,
    country_id: number
}

export interface RegionJoinedFetch extends Region {
    country_name: string
}
