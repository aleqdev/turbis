import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import ClientType from "../../interface/client_type";
import { clientTypesR, useAppDispatch } from "../../redux/store";
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

export const ClientTypesList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список типов клиентов:"
      selector={state => state.clientTypes}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(clientTypesR.select(selected.selectedRows as ClientType[]))}
    />
  );
}