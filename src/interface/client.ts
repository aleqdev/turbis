import ClientType from "./client_type"
import Person from "./person"

export class Client {
  id: number;
  type_id: number;
  person_id: number;
  type?: ClientType;
  person?: Person;

  constructor(args: {[Property in keyof Client]: Client[Property]}) {
    this.id = args.id;
    this.type_id = args.type_id;
    this.person_id = args.person_id;
    this.type = args.type;
    this.person = args.person;
  }

  static format(client: Client): string {
    return Person.format(client.person!);
  }
}

export default Client;
