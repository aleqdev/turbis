import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { tourOrderPaymentTypesR, useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";
import TourOrderPaymentType from "../../interface/tour_order_payment_type";

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
    wrap: true,
  }
];

export const TourOrderPaymentTypesList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список типов оплаты заказов туров:"
      selector={state => state.tourOrderPaymentTypes}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(tourOrderPaymentTypesR.select(selected.selectedRows as TourOrderPaymentType[]))}
    />
  );
}
