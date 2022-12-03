import Region from "./region";

export class City {
    id: number;
    name: string;
    region_id: number;
    crt_date: Date;
    region?: Region;

    constructor(args: {[Property in keyof City]: City[Property]}) {
        this.id = args.id;
        this.name = args.name;
        this.region_id = args.region_id;
        this.crt_date = args.crt_date;
        this.region = args.region;
    }

    static format<fieldName extends string>(value: City | {[_ in fieldName]?: City}, field?: fieldName): string {
        if (field === undefined) {
            value = value as City;
            return `${Region.format(value.region!)}, ${value.name}`;
        }
        return City.format((value as any)[field!]!);
    }

    static makeFormatter<fieldName extends string>(field?: fieldName): typeof City.format {
        return (e: any) => City.format(e, field);
    }
}

export default City;
