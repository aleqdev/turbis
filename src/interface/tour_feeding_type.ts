
export class TourFeedingType {
  id: number;
  name: string;

  constructor(args: {[Property in keyof TourFeedingType]: TourFeedingType[Property]}) {
    this.id = args.id;
    this.name = args.name;
  }
}

export default TourFeedingType;
