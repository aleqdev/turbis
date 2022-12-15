import { IonCol, IonGrid, IonItem, IonRow } from "@ionic/react";
import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import Tour from "../../interface/tour";
import { toursR, useAppDispatch } from "../../redux/store";
import { formatDate, formatDateDiff } from "../../utils/fmt";
import { Table } from "../table_management/Table";

const listColumns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
    wrap: true
  },
  {
    name: "Отель",
    selector: "hotel.name",
    sortable: true,
    wrap: true,
    cell: (e: Tour) => {
      return (
        <IonItem routerLink={`/page/Hotels`} lines='none'>
          <small style={{textDecoration: "underline", color: "#F60", cursor: "pointer"}}>
            {`${e.hotel?.name}`}
          </small>
        </IonItem>
      )
    }
  },
  {
    name: "Дата заезда",
    selector: "arrival_date",
    sortable: true,
    wrap: true,
    cell: (e: Tour) => formatDate(e.arrival_date)
  },
  {
    name: "Дата выезда",
    selector: "departure_date",
    sortable: true,
    wrap: true,
    cell: (e: Tour) => formatDate(e.departure_date)
  },
  {
    name: "Кол-во дней/ночей",
    selector: "departure_date",
    sortable: true,
    wrap: true,
    cell: (e: Tour) => formatDateDiff(e.arrival_date, e.departure_date)
  },
  {
    name: "Вид питания",
    selector: "feeding_type.name",
    sortable: true,
    wrap: true,
  },
  {
    name: "Стоимость",
    selector: "cost",
    sortable: true,
    wrap: true,
    cell: (e: Tour) => `${e.price} руб.`
  },
];

const ExpandedTour = ({ data }: { data: any}) => {
  return (
    <IonGrid>
      <IonGrid>
        <IonRow>
          <IonCol>{'ID:'}</IonCol>
          <IonCol size='10'>{data.id}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Отель:'}</IonCol>
          <IonCol size='10'>{data.hotel.name}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Дата заезда:'}</IonCol>
          <IonCol size='10'>{formatDate(data.arrival_date)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Дата выезда:'}</IonCol>
          <IonCol size='10'>{formatDate(data.departure_date)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Кол-во дней/ночей:'}</IonCol>
          <IonCol size='10'>
            {
              formatDateDiff(data.arrival_date, data.departure_date)
            }
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Вид питания:'}</IonCol>
          <IonCol size='10'>{data.feeding_type.name}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Стоимость:'}</IonCol>
          <IonCol size='10'>{`${data.price} руб.`}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Описание:'}</IonCol>
          <IonCol size='10'>{data.description}</IonCol>
        </IonRow>
      </IonGrid>
    </IonGrid>
  );
}

export const ToursList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список туров:"
      selector={state => state.tours}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(toursR.select(selected.selectedRows as Tour[]))}
      expandableRows
      expandableRowsComponent={ExpandedTour}
    />
  );
}
