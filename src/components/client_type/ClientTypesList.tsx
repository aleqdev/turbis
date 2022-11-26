import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import ClientType from "../../interface/client_type";
import { useAppSelector } from "../../redux/store";

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
    wrap: true
  }
];

export interface EmployeeRolesListProps {
  on_selected_change: Dispatch<React.SetStateAction<Array<ClientType>>>
}

export const ClientTypesList: React.FC<EmployeeRolesListProps> = (props) => {
  const clientTypes = useAppSelector(state => state.clientTypes);

  return (
    <IonList id="client-types-list">
      {
        (clientTypes.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (clientTypes.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={clientTypes.data}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список типов клиентов:"
            columns={listColumns as any}
            data={clientTypes.data}
            defaultSortFieldId="name"
            onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
            pagination
            selectableRows
            highlightOnHover
            noDataComponent="Пусто"
            paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
          />
         </DataTableExtensions>
  
      }
    </IonList>
  );
}