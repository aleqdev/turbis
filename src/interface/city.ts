import Region from "./region";

export type City = {
    id: number,
    name: string,
    region_id: number,
    crt_date: Date,
    region?: Region
}

export default City;
