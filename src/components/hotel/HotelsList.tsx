import { IonCol, IonGrid, IonList, IonRow, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import { HotelJoinedFetch } from "../../interface/hotel";
import { formatHotelCity, formatHotelOwner } from "../../utils/fmt";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';

const listColumns = [
  {
    name: "Название",
    selector: "name",
    sortable: true
  },
  {
    name: "Местоположение",
    selector: "city_name",
    sortable: true,
    cell: (row: HotelJoinedFetch) => formatHotelCity(row)
  },
  {
    name: "Владелец",
    selector: "owner_phone_number",
    sortable: true,
    cell: (row: HotelJoinedFetch) => formatHotelOwner(row)
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
          <DataTableExtensions
            columns={listColumns}
            data={props.hotels}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
              title="Список отелей:"
              columns={listColumns as any}
              data={props.hotels}
              defaultSortFieldId="name"
              onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
              pagination
              selectableRows
              expandableRows={true}
              expandableRowsComponent={ExpandedHotel}
            />
          </DataTableExtensions>
      }
    </IonList>
  );
}