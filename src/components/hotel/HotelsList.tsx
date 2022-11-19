import { IonCol, IonGrid, IonList, IonRow, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { HotelJoinedFetch } from "../../interface/hotel";
import { formatHotelCity, formatHotelOwner } from "../../utils/fmt";

const listColumns: TableColumn<HotelJoinedFetch>[] = [
  {
    name: "Название",
    selector: (row: HotelJoinedFetch) => row.name,
    sortable: true
  },
  {
    name: "Местоположение",
    selector: (row: HotelJoinedFetch) => `${row.country_name}, ${row.region_name}, ${row.city_name}`,
    sortable: true
  },
  {
    name: "Владелец",
    selector: (row: HotelJoinedFetch) => `${row.owner_surname} ${row.owner_name[0]}. ${row.owner_last_name[0]}. (+${row.owner_phone_number})`,
    sortable: true
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
          <IonCol size='10'>{formatHotelOwner(data)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Местоположение:'}</IonCol>
          <IonCol size='10'>{formatHotelCity(data)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{'Описание:'}</IonCol>
          <IonCol size='10'>{data.description}</IonCol>
        </IonRow>
      </IonGrid>
    </IonGrid>
  );
}

export interface HotelsListProps {
  hotels: Array<HotelJoinedFetch> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<HotelJoinedFetch>>>
}

export const HotelsList: React.FC<HotelsListProps> = (props) => {
  return (
    <IonList id="hotels-list">
      {
        (props.hotels === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTable
            title="Список отелей:"
            columns={listColumns}
            data={props.hotels}
            defaultSortFieldId="name"
            onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
            pagination
            selectableRows
            expandableRows={true}
            expandableRowsComponent={ExpandedHotel}
          />
      }
    </IonList>
  );
}