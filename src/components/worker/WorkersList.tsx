import { IonList, IonTitle } from "@ionic/react";
import axios from "axios";
import React, { Dispatch } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { WorkerJoinedFetch } from "../../interface/worker";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';

const listColumns = [
  {
    name: "name",
    selector: (row: WorkerJoinedFetch) => row.name,
    sortable: true,
    wrap: true
  },
  {
    name: "Фамилия",
    selector: (row: WorkerJoinedFetch) => row.surname,
    sortable: true,
    wrap: true
  },
  {
    name: "Отчество",
    selector: (row: WorkerJoinedFetch) => row.last_name,
    sortable: true,
    wrap: true
  },
  {
    name: "Телефон",
    selector: (row: WorkerJoinedFetch) => row.phone_number,
    sortable: true,
    wrap: true
  },
  {
    name: "Почта",
    selector: (row: WorkerJoinedFetch) => row.email,
    sortable: true,
    wrap: true
  },
  {
    name: "Роль",
    selector: (row: WorkerJoinedFetch) => row.role_name,
    sortable: true,
    wrap: true
  }
];

export interface WorkersListProps {
  workers: Array<WorkerJoinedFetch> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<WorkerJoinedFetch>>>
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
          >
            <DataTable
            title="Список сотрудников:"
            columns={listColumns}
            data={props.workers}
            // noHeader={true}
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