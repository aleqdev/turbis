import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { tourOrderPaymentsR, tourOrdersR, useAppDispatch, useAppSelector } from "../../redux/store";
import { Table } from "../table_management/Table";
import TourOrderPayment from "../../interface/tour_order_payment";
import Person from "../../interface/person";
import { PatchOrderModalFn } from "../tour_order/PatchOrder";
import { DatabaseAuth } from "../../interface/database_auth";
import { IonItem } from "@ionic/react";

function makeListColumns(openPatchTourOrder: () => void, dispatch: ReturnType<typeof useAppDispatch>, auth: DatabaseAuth) {
  return [
    {
      name: "Заказ",
      selector: "order",
      sortable: true,
      wrap: true,
      cell: (e: TourOrderPayment) => {
        return (
          <IonItem routerLink={`/page/TourOrders`} lines='none'>
            <small style={{textDecoration: "underline", color: "#F60", cursor: "pointer"}}>
              {`${e.order!.tour!.hotel!.name}, ${e.order!.tour!.hotel!.city!.name} (${Person.format(e.order!.client!.person!)} <${e.order!.client!.type!.name})>`}
            </small>
          </IonItem>
        )
      }
    },
    {
      name: "Сумма оплаты",
      selector: "money_received",
      sortable: true,
      wrap: true,
      cell: (e: TourOrderPayment) => `${e.money_received} руб.`
    }
  ];
}

export const TourOrderPaymentsList: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const openPatchTourOrder = PatchOrderModalFn();

  return (
    <Table 
      title="Список записей об оплате заказов туров:"
      selector={state => state.tourOrderPayments}
      columns={makeListColumns(openPatchTourOrder, dispatch, auth as DatabaseAuth) as any}
      selectRowsCallback={selected => {dispatch(tourOrderPaymentsR.select(selected.selectedRows as TourOrderPayment[]))}}
    />
  );
}
