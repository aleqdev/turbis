import { IonCol, IonGrid, IonRow } from "@ionic/react";
import React, { useEffect } from "react";
import 'react-data-table-component-extensions/dist/index.css';
import City from "../../interface/city";
import Hotel from "../../interface/hotel";
import Person from "../../interface/person";
import { AuthProps } from "../../interface/props/auth";
import { citiesR, hotelsR, personsR, useAppDispatch } from "../../redux/store";
import { Table } from "../table_management/Table";

export function PutHotelModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  console.log('good')
  useEffect(() => {
    dispatch(personsR.fetch(auth));
    dispatch(citiesR.fetch(auth));
  }, []);
}


const listColumns = [
  {
    name: "Название",
    selector: "name",
    sortable: true
  },
  {
    name: "Местоположение",
    selector: "city",
    sortable: true,
    cell: City.makeFormatter("city")
  },
  {
    name: "Владелец",
    selector: "owner",
    sortable: true,
    cell: Person.makeFormatter("owner")
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
          <IonCol size='10'>{Person.format(data.owner)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Местоположение:'}</IonCol>
          <IonCol size='10'>{City.format(data.city)}</IonCol>
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

function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
