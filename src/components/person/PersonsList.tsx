import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import Person from "../../interface/person";
import { AuthProps } from "../../interface/props/auth";

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
    cell: (e: Person) => `+${e.phone_number}`
  },
  {
    name: "Почта",
    selector: "email",
    sortable: true,
    wrap: true
  }
];

export interface PersonsListProps {
  persons: Array<Person> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<Person>>>,
  clear_selection_trigger: boolean
}

export const PersonsList: React.FC<PersonsListProps> = (props) => {
  return (
    <IonList id="persons-list">
      {
        (props.persons === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={props.persons}
            print={true}
            export={true}
            exportHeaders={true}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список контактных лиц:"
            columns={listColumns as any}
            data={props.persons}
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