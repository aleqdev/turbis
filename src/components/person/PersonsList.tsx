import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import Person from "../../interface/person";
import { useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import { personsR } from "../../redux/store";

const listColumns = [
  {
    name: "Имя",
    selector: "name",
    sortable: true,
    wrap: true
  },
  {
    name: "Фамилия",
    selector: "surname",
    sortable: true,
    wrap: true
  },
  {
    name: "Отчество",
    selector: "last_name",
    sortable: true,
    wrap: true
  },
  {
    name: "Телефон",
    selector: "phone_number",
    sortable: true,
    wrap: true,
    cell: (e: Person) => `+${e.phone_number}`
  },
  {
    name: "Почта",
    selector: "email",
    sortable: true,
    wrap: true
  }
];

export const PersonsList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список контактных лиц:"
      selector={state => state.persons}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(personsR.select(selected.selectedRows as Person[]))}
    />
  );
}