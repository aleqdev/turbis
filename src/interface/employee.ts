import EmployeeRole from "./employee_role"
import Person from "./person"

export class Employee {
  id: number;
  person_id: number;
  role_id: number;
  person?: Person;
  role?: EmployeeRole;

  constructor(args: {[Property in keyof Employee]: Employee[Property]}) {
    this.id = args.id;
    this.person_id = args.person_id;
    this.role_id = args.role_id;
    this.person = args.person;
    this.role = args.role;
  }
}

export default Employee;
