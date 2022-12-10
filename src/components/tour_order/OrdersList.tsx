import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import { tourOrdersR } from "../../redux/store";
import TourOrder from "../../interface/tour_order";
import { formatDate } from "../../utils/fmt";
import Person from "../../interface/person";

const listColumns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
    wrap: true
  },
  {
    name: "Заказная группа",
    selector: "group_id",
    sortable: true,
    wrap: true
  },
  {
    name: "Клиент",
    selector: "person",
    sortable: true,
    wrap: true,
    cell: (e: TourOrder) => `${Person.format(e.client?.person!)} <${e.client?.type?.name}>`
  },
  {
    name: "Вид оплаты",
    selector: "payment_type.name",
    sortable: true,
    wrap: true
  },
  {
    name: "Тур",
    selector: "tour",
    sortable: true,
    wrap: true,
    cell: (e: TourOrder) => `${e.tour?.hotel?.name} (с ${formatDate(e.tour?.arrival_date!)} по ${formatDate(e.tour?.departure_date!)})`
  },
  {
    name: "Цена",
    selector: "price",
    sortable: true,
    wrap: true
  },
  {
    name: "Кол-во",
    selector: "people_count",
    sortable: true,
    wrap: true
  },
  {
    name: "Стоимость",
    selector: "cost",
    sortable: true,
    wrap: true
  },
  {
    name: "Статус",
    selector: "status",
    sortable: true,
    wrap: true,
    cell: TourOrder.formatStatus
  },
];

export const OrdersList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список заказов тура:"
      selector={state => state.tourOrders}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(tourOrdersR.select(selected.selectedRows as TourOrder[]))}
    />
  );
}
