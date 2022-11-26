import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import ClientType from "../../interface/client_type";

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
  client_types: Array<ClientType> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<ClientType>>>
}

export const ClientTypesList: React.FC<EmployeeRolesListProps> = (props) => {
  return (
    <IonList id="client-types-list">
      {
        (props.client_types === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={props.client_types}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список типов клиентов:"
            columns={listColumns as any}
            data={props.client_types}
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