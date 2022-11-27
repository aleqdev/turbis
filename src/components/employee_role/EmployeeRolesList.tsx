import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { EmployeeRole } from "../../interface/employee_role";
import { employeeRolesR, useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";

const listColumns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
    wrap: true
  },
  {
    name: "Название",
    selector: "name",
    sortable: true,
    wrap: true
  }
];

export const EmployeeRolesList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список ролей сотрудников:"
      selector={state => state.employeeRoles}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(employeeRolesR.select(selected.selectedRows as EmployeeRole[]))}
    />
  );
}