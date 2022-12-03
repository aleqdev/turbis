
export class Person {
  id: number;

  name: string;
  surname: string;
  last_name: string;

  phone_number: string;
  email: string;

  constructor(args: {[Property in keyof Person]: Person[Property]}) {
    this.id = args.id;
    this.name = args.name;
    this.surname = args.surname;
    this.last_name = args.last_name;
    this.phone_number = args.phone_number;
    this.email = args.email;
  }

  static formatPersonPhoneNumber<fieldName extends string>(value: Person | {[_ in fieldName]?: Person}, field?: fieldName): string {
    if (field === undefined) {
      value = value as Person;
      return `+${value.phone_number}`;
    }
    return Person.formatPersonPhoneNumber((value as any)[field!]!);
  }

  static makePersonPhoneNumberFormatter<fieldName extends string>(field?: fieldName): typeof Person.formatPersonPhoneNumber {
    return (e: any) => Person.formatPersonPhoneNumber(e, field);
  }

  static format<fieldName extends string>(value: Person | {[_ in fieldName]?: Person}, field?: fieldName): string {
    if (field === undefined) {
      value = value as Person;
      return `${value.surname} ${value.name[0]}. ${value.last_name[0]}. ${Person.formatPersonPhoneNumber(value)}`;
    }
    return Person.format((value as any)[field!]!);
  }

  static makeFormatter<fieldName extends string>(field?: fieldName): typeof Person.format {
    return (e: any) => Person.format(e, field);
  }
}

export default Person;
