import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { WorkerRole } from "../../interface/worker_role";

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

export interface WorkerRolesListProps {
  worker_roles: Array<WorkerRole> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<WorkerRole>>>
}

export const WorkerRolesList: React.FC<WorkerRolesListProps> = (props) => {
  return (
    <IonList id="workers-roles-list">
      {
        (props.worker_roles === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={props.worker_roles}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список ролей:"
            columns={listColumns as any}
            data={props.worker_roles}
            defaultSortFieldId="name"
            onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
            pagination
            selectableRows
            highlightOnHover
          />
         </DataTableExtensions>
  
      }
    </IonList>
  );
}