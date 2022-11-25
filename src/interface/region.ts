import Country from "./country"

export type Region = {
    id: number,
    name: string,
    country_id: number,
    country?: Country
}

export default Region;
