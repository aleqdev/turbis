export interface Hotel {
    id: number,
    name: string,
    city_id: number,
    owner_id: number,
    description: string
}

export interface HotelJoinedFetch extends Hotel {
    city_name: string,
    region_id: number,
    region_name: string,
    country_id: number,
    country_name: string,
    owner_role_id: number,
    owner_name: string,
    owner_surname: string,
    owner_last_name: string,
    owner_phone_number: string,
    owber_email: string
}
