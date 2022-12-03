export class DatabaseAuth {
  email: string;
  password: string;

  constructor(args: {[Property in keyof DatabaseAuth]: DatabaseAuth[Property]}) {
    this.email = args.email;
    this.password = args.password;
  }
}