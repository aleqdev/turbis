import City from "./city"
import Person from "./person"

export class Hotel {
    id: number;
    name: string;
    city_id: number;
    owner_id: number;
    description: string;
    city?: City;
    owner?: Person;

    constructor(args: {[Property in keyof Hotel]: Hotel[Property]}) {
        this.id = args.id;
        this.name = args.name;
        this.city_id = args.city_id;
        this.owner_id = args.owner_id;
        this.description = args.description;
        this.city = args.city;
        this.owner = args.owner;
    }

    static format(hotel: Hotel): string {
        return `${hotel.name}, г.${hotel.city?.name}`
    }
}

export default Hotel;
