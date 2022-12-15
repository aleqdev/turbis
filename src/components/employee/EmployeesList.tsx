import { IonItem } from "@ionic/react";
import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import Employee from "../../interface/employee";
import Person from "../../interface/person";
import { employeesR, useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";

const listColumns = [
  {
    name: "Имя",
    selector: "person.name",
    sortable: true,
    wrap: true
  },
  {
    name: "Фамилия",
    selector: "person.surname",
    sortable: true,
    wrap: true
  },
  {
    name: "Отчество",
    selector: "person.last_name",
    sortable: true,
    wrap: true
  },
  {
    name: "Телефон",
    selector: "person",
    sortable: true,
    wrap: true,
    cell: Person.makePersonPhoneNumberFormatter("person")
  },
  {
    name: "Почта",
    selector: "person.email",
    sortable: true,
    wrap: true
  },
  {
    name: "Роль",
    selector: "role.name",
    sortable: true,
    wrap: true,
    cell: (e: Employee) => {
      return (
        <IonItem routerLink={`/page/EmployeeRoles`} lines='none'>
          <small style={{textDecoration: "underline", color: "#F60", cursor: "pointer"}}>
            {`${e.role!.name}`}
          </small>
        </IonItem>
      )
    }
  }
];

export const EmployeesList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список сотрудников:"
      selector={state => state.employees}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(employeesR.select(selected.selectedRows as Employee[]))}
    />
  );
}