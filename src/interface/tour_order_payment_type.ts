export class TourOrderPaymentType {
  id: number;
  name: string;

  constructor(args: {[Property in keyof TourOrderPaymentType]: TourOrderPaymentType[Property]}) {
    this.id = args.id;
    this.name = args.name;
  }

  static format(type: TourOrderPaymentType): string {
    return `${type.name}`;
  }
}

export default TourOrderPaymentType;
