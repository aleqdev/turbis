import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import { tourOrdersR } from "../../redux/store";
import TourOrder from "../../interface/tour_order";
import { formatPerson } from "../../utils/fmt";

const listColumns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
    wrap: true
  },
  {
    name: "Клиент",
    selector: "person",
    sortable: true,
    wrap: true,
    cell: (e: TourOrder) => `${formatPerson(e.client?.person!)} <${e.client?.type?.name}, +${e.client?.person?.phone_number}>`
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
    cell: (e: TourOrder) => `${e.tour?.hotel?.name} (с ${e.tour?.arrival_date} по ${e.tour?.departure_date})`
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
