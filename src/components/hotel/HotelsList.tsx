import { IonCol, IonGrid, IonList, IonRow, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import Hotel from "../../interface/hotel";
import { useAppSelector } from "../../redux/store";
import { formatCity, formatPerson } from "../../utils/fmt";

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

export type HotelsListProps = {
  on_selected_change: Dispatch<React.SetStateAction<Array<Hotel>>>,
  clear_selection_trigger: boolean
}

export const HotelsList: React.FC<HotelsListProps> = (props) => {
  const hotels = useAppSelector(state => state.hotels);
  
  return (
    <IonList id="hotels-list">
      {
        (hotels.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (hotels.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={hotels.data}
            print={true}
            export={true}
            exportHeaders={true}
            filterPlaceholder="Поиск"
          >
            <DataTable
              title="Список отелей:"
              columns={listColumns as any}
              data={hotels.data}
              defaultSortFieldId="name"
              onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
              pagination
              selectableRows
              expandableRows={true}
              expandableRowsComponent={ExpandedHotel}
              clearSelectedRows={props.clear_selection_trigger}
              noDataComponent="Пусто"
              paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
            />
          </DataTableExtensions>
      }
    </IonList>
  );
}