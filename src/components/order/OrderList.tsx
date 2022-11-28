import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import Client from "../../interface/client";
import { useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import { clientsR } from "../../redux/store";

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
    selector: "person.phone_number",
    sortable: true,
    wrap: true,
    cell: (e: Client) => `+${e.person!.phone_number}`
  },
  {
    name: "Почта",
    selector: "person.email",
    sortable: true,
    wrap: true
  },
  {
    name: "Тип",
    selector: "type.name",
    sortable: true,
    wrap: true
  }
];

export const OrdersList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список заказов тура:"
      selector={state => state.clients}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(clientsR.select(selected.selectedRows as Client[]))}
    />
  );
}