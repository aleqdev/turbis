import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { tourOrderPaymentsR, useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import TourOrderPayment from "../../interface/tour_order_payment";
import TourOrder from "../../interface/tour_order";
import Person from "../../interface/person";

const listColumns = [
  // {
  //   name: "ID",
  //   selector: "ord",
  //   sortable: true,
  //   wrap: true
  // },
  {
    name: "Название тура",
    selector: "order.tour.hotel.name",
    sortable: true,
    wrap: true,
  },
  {
    name: "Клиент",
    selector: "order.client.person",
    sortable: true,
    wrap: true,
    // cell: (e: any) => `${e.order.client.person.name}`,
    cell: (e: any) => `${Person.format(e.order.client.person)} <${e.order.client.type?.name}>`
  },
  {
    name: "Оплачено",
    selector: "order.price",
    sortable: true,
    wrap: true,
    cell: (e: any) => `${e.order.price} руб.`
  }
];

export const TourOrderPaymentsList: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <Table 
      title="Список записей об оплате заказов туров:"
      selector={state => state.tourOrderPayments}
      columns={listColumns as any}
      selectRowsCallback={selected => {dispatch(tourOrderPaymentsR.select(selected.selectedRows as TourOrderPayment[]))}}
    />
  );
}
