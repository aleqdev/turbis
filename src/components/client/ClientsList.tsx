import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import Client from "../../interface/client";
import { useAppSelector } from "../../redux/store";

const listColumns = [
  {
    name: "Имя",
    selector: "person.name",
    sortable: true,
    wrap: true
  },
  {
    name: "Фамилия",
    selector: "person.surname",
    sortable: true,
    wrap: true
  },
  {
    name: "Отчество",
    selector: "person.last_name",
    sortable: true,
    wrap: true
  },
  {
    name: "Телефон",
    selector: "person.phone_number",
    sortable: true,
    wrap: true,
    cell: (e: Client) => `+${e.person!.phone_number}`
  },
  {
    name: "Почта",
    selector: "person.email",
    sortable: true,
    wrap: true
  },
  {
    name: "Тип",
    selector: "type.name",
    sortable: true,
    wrap: true
  }
];

export interface ClientsListProps {
  on_selected_change: Dispatch<React.SetStateAction<Array<Client>>>,
  clear_selection_trigger: boolean
}

export const ClientsList: React.FC<ClientsListProps> = (props) => {
  const clients = useAppSelector(state => state.clients);

  return (
    <IonList id="clients-list">
      {
        (clients.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (clients.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={clients.data}
            print={true}
            export={true}
            exportHeaders={true}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список клиентов:"
            columns={listColumns as any}
            data={clients.data}
            defaultSortFieldId="name"
            onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
            pagination
            selectableRows
            highlightOnHover
            clearSelectedRows={props.clear_selection_trigger}
            noDataComponent="Пусто"
            paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
          />
         </DataTableExtensions>
  
      }
    </IonList>
  );
}