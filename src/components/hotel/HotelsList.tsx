import { IonCol, IonGrid, IonRow } from "@ionic/react";
import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import Hotel from "../../interface/hotel";
import { hotelsR, useAppDispatch } from "../../redux/store";
import { formatCity, formatPerson } from "../../utils/fmt";
import { Table } from "../table_management/Table";

const listColumns = [
  {
    name: "Название",
    selector: "name",
    sortable: true
  },
  {
    name: "Местоположение",
    selector: "city.name",
    sortable: true,
    cell: (row: Hotel) => formatCity(row.city!)
  },
  {
    name: "Владелец",
    selector: "owner.phone_number",
    sortable: true,
    cell: (row: Hotel) => formatPerson(row.owner!)
  },
];

const ExpandedHotel = ({ data }: { data: any}) => {
  return (
    <IonGrid>
      <IonGrid>
        <IonRow>
          <IonCol>{'ID:'}</IonCol>
          <IonCol size='10'>{data.id}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Название:'}</IonCol>
          <IonCol size='10'>{data.name}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Владелец:'}</IonCol>
          <IonCol size='10'>{formatPerson(data.owner)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Местоположение:'}</IonCol>
          <IonCol size='10'>{formatCity(data.city)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Описание:'}</IonCol>
          <IonCol size='10'>{data.description}</IonCol>
        </IonRow>
      </IonGrid>
    </IonGrid>
  );
}

export const HotelsList: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Table 
      title="Список отелей:"
      selector={state => state.hotels}
      columns={listColumns as any}
      selectRowsCallback={selected => dispatch(hotelsR.select(selected.selectedRows as Hotel[]))}
      expandableRows
      expandableRowsComponent={ExpandedHotel}
    />
  );
}