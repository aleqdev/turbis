export type Region = {
    id: number,
    name: string,
    country_id: number
}

export type RegionJoinedFetch = Region & {
    country_name: string
}
