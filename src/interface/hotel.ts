import City from "./city"
import Person from "./person"

export type Hotel = {
    id: number,
    name: string,
    city_id: number,
    owner_id: number,
    description: string,
    city?: City,
    owner?: Person
}

export default Hotel;
