import React, { useEffect, useState } from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { toursR, useAppDispatch, useAppSelector } from "../../redux/store";
import { Table } from "../table_management/Table";
import { tourOrdersR } from "../../redux/store";
import TourOrder from "../../interface/tour_order";
import { formatDate } from "../../utils/fmt";
import Person from "../../interface/person";
import { DatabaseAuth } from "../../interface/database_auth";
import { PatchTourModalFn } from "../tour/PatchTour";
import { IonItem } from "@ionic/react";

function makeListColumns(openPatchTour: () => void, dispatch: ReturnType<typeof useAppDispatch>, auth: DatabaseAuth) {
  return [
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
      name: "Дата",
      selector: "crt_date",
      sortable: true,
      wrap: true,
      cell: (e: TourOrder) => `${formatDate(e.crt_date)}`
    },
    {
      name: "Клиент",
      selector: "person",
      sortable: true,
      wrap: true,
      cell: (e: TourOrder) => {
        return (
          <IonItem routerLink={`/page/Clients`} lines='none'>
            <small style={{textDecoration: "underline", color: "#F60", cursor: "pointer"}}>
              {`${Person.format(e.client?.person!)} <${e.client?.type?.name}>`}
            </small>
          </IonItem>
        )
      }
    },
    {
      name: "Вид оплаты",
      selector: "payment_type.name",
      sortable: true,
      wrap: true,
      cell: (e: TourOrder) => {
        return (
          <IonItem routerLink={`/page/TourOrderPaymentTypes`} lines='none'>
            <small style={{textDecoration: "underline", color: "#F60", cursor: "pointer"}}>
              {`${e.payment_type!.name}`}
            </small>
          </IonItem>
        )
      }
    },
    {
      name: "Тур",
      selector: "tour",
      sortable: true,
      wrap: true,
      cell: (e: TourOrder) => {
        return (
          <IonItem routerLink={`/page/Tours`} lines='none'>
            <small style={{textDecoration: "underline", color: "#F60", cursor: "pointer"}}>
              {`${e.tour?.hotel?.name} (с ${formatDate(e.tour?.arrival_date!)} по ${formatDate(e.tour?.departure_date!)})`}
            </small>
          </IonItem>
        )
      }
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
}

export const OrdersList: React.FC<{filter?: string}> = ({ filter }) => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const openPatchTour = PatchTourModalFn();

  return (
    <Table 
      title="Список заказов тура:"
      selector={state => state.tourOrders}
      columns={makeListColumns(openPatchTour, dispatch, auth as DatabaseAuth) as any}
      selectRowsCallback={selected => dispatch(tourOrdersR.select(selected.selectedRows as TourOrder[]))}
      filter={filter}
    />
  );
}
