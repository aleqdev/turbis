import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import { WorkerJoinedFetch } from "../../interface/worker";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';

const listColumns = [
  {
    name: "Имя",
    selector: "name",
    sortable: true,
    wrap: true
  },
  {
    name: "Фамилия",
    selector: "surname",
    sortable: true,
    wrap: true
  },
  {
    name: "Отчество",
    selector: "last_name",
    sortable: true,
    wrap: true
  },
  {
    name: "Телефон",
    selector: "phone_number",
    sortable: true,
    wrap: true,
    cell: (e: WorkerJoinedFetch) => `+${e.phone_number}`
  },
  {
    name: "Почта",
    selector: "email",
    sortable: true,
    wrap: true
  },
  {
    name: "Роль",
    selector: "role_name",
    sortable: true,
    wrap: true
  }
];

export interface WorkersListProps {
  workers: Array<WorkerJoinedFetch> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<WorkerJoinedFetch>>>,
  clear_selection_trigger: boolean
}

export const WorkersList: React.FC<WorkersListProps> = (props) => {
  return (
    <IonList id="workers-list">
      {
        (props.workers === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={props.workers}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список контактных лиц:"
            columns={listColumns as any}
            data={props.workers}
            defaultSortFieldId="name"
            onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
            pagination
            selectableRows
            highlightOnHover
            clearSelectedRows={props.clear_selection_trigger}
          />
         </DataTableExtensions>
  
      }
    </IonList>
  );
}