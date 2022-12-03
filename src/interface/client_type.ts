
export class ClientType {
  id: number;
  name: string;

  constructor(args: {[Property in keyof ClientType]: ClientType[Property]}) {
    this.id = args.id;
    this.name = args.name;
  }
}

export default ClientType;
