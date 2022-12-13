import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { tourOrderPurchasesR, useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import TourOrderPurchase from "../../interface/tour_order_purchase";
import Person from "../../interface/person";
import { formatDate } from "../../utils/fmt";

const listColumns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
    wrap: true
  },
  {
    name: "Дата",
    selector: "crt_date",
    sortable: true,
    wrap: true,
    cell: (e: TourOrderPurchase) => `${formatDate(e.crt_date)}`
  },
  {
    name: "Клиент",
    selector: "client",
    sortable: true,
    wrap: true,
    cell: (e: TourOrderPurchase) => `${Person.format(e!.client!.person!)} <${e!.client!.type!.name}>`
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
    cell: (e: TourOrderPurchase) => `${e!.tour!.hotel!.name}`
  },
  {
    name: "Цена",
    selector: "price",
    sortable: true,
    wrap: true
  },
  {
    name: "Кол-во людей",
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
