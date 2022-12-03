import Country from "./country"

export class Region {
    id: number;
    name: string;
    country_id: number;
    country?: Country;

    constructor(args: {[Property in keyof Region]: Region[Property]}) {
        this.id = args.id;
        this.name = args.name;
        this.country_id = args.country_id;
        this.country = args.country;
    }

    static format(region: Region): string {
        return `${Country.format(region.country!)}, ${region.name}`;
    }
}

export default Region;
