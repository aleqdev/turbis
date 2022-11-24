import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import Employee from "../../interface/employee";

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
    cell: (e: Employee) => `+${e.person!.phone_number}`
  },
  {
    name: "Почта",
    selector: "person.email",
    sortable: true,
    wrap: true
  },
  {
    name: "Роль",
    selector: "role.name",
    sortable: true,
    wrap: true
  }
];

export interface EmployeesListProps {
  employees: Array<Employee> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<Employee>>>,
  clear_selection_trigger: boolean
}

export const EmployeesList: React.FC<EmployeesListProps> = (props) => {
  return (
    <IonList id="employees-list">
      {
        (props.employees === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={props.employees}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список сотрудников:"
            columns={listColumns as any}
            data={props.employees}
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