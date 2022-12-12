import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { Table } from "../table_management/Table";

const listColumns = [
  {
    name: "Тур",
    selector: "tour.hotel.name",
    sortable: true,
    wrap: true
  },
  {
    name: "Кол-во заказов",
    selector: "ordered",
    sortable: true,
    wrap: true
  },
  {
    name: "Кол-во продаж",
    selector: "selled",
    sortable: true,
    wrap: true
  },
];

export const TourOrderTurnoverTable: React.FC = () => {
  return (
    <Table 
      title="Сведенья об оборотах туров:"
      selector={state => {
        const turnover = state.tourOrderTurnover;
        return turnover.status === "ok" ? turnover.data.entries : []
      }}
      columns={listColumns as any}
      selectableRows={false}
    />
  );
}
