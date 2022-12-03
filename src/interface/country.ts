export class Country {
    id: number;
    name: string;
    crt_date: Date;

    constructor(args: {[Property in keyof Country]: Country[Property]}) {
        this.id = args.id;
        this.name = args.name;
        this.crt_date = args.crt_date;
    }

    static format(country: Country): string {
        return `${country.name}`;
    }
}

export default Country;
