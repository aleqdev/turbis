export class EmployeeRole {
    id: number;
    name: string;

    constructor(args: {[Property in keyof EmployeeRole]: EmployeeRole[Property]}) {
        this.id = args.id;
        this.name = args.name;
    }
}

export default EmployeeRole;
