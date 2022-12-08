import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { tourOrderPurchasesR, useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import TourOrderPurchase from "../../interface/tour_order_purchase";
import Person from "../../interface/person";
import { formatDate } from "../../utils/fmt";

const listColumns = [
  {
    name: "Заказная группа",
    selector: "order.group_id",
    sortable: true,
    wrap: true
  },
  {
    name: "Клиент",
    selector: "order.person",
    sortable: true,
    wrap: true,
    cell: (e: TourOrderPurchase) => `${Person.format(e.order!.client!.person!)} <${e.order!.client!.type!.name}>`
  },
  {
    name: "Вид оплаты",
    selector: "order.payment_type.name",
    sortable: true,
    wrap: true
  },
  {
    name: "Тур",
    selector: "order.tour",
    sortable: true,
    wrap: true,
    cell: (e: TourOrderPurchase) => `${e.order!.tour!.hotel!.name} (с ${formatDate(e.order!.tour!.arrival_date!)} по ${formatDate(e.order!.tour!.departure_date!)})`
  },
  {
    name: "Цена",
    selector: "order.price",
    sortable: true,
    wrap: true
  },
  {
    name: "Кол-во",
    selector: "order.people_count",
    sortable: true,
    wrap: true
  },
  {
    name: "Стоимость",
    selector: "order.cost",
    sortable: true,
    wrap: true
  },
  {
    name: "Бронь номеров подтверждена",
    selector: "reservations_confirmed",
    sortable: true,
    wrap: true,
    cell: (c: TourOrderPurchase) => (c.reservations_confirmed ? "Да" : "Нет")
  },
];

export const TourOrderPurchasesList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список записей об продажах заказов туров:"
      selector={state => state.tourOrderPurchases}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(tourOrderPurchasesR.select(selected.selectedRows as TourOrderPurchase[]))}
    />
  );
}
