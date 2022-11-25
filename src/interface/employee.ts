import EmployeeRole from "./employee_role"
import Person from "./person"

export interface Employee {
  id: number,
  person_id: number,
  role_id: number,
  person?: Person,
  role?: EmployeeRole
}

export default Employee;
