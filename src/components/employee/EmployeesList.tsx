import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import Employee from "../../interface/employee";
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
  on_selected_change: Dispatch<React.SetStateAction<Array<Employee>>>,
  clear_selection_trigger: boolean
}

export const EmployeesList: React.FC<EmployeesListProps> = (props) => {
  const employees = useAppSelector(state => state.employees);
  
  return (
    <IonList id="employees-list">
      {
        (employees.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (employees.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={employees.data}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список сотрудников:"
            columns={listColumns as any}
            data={employees.data}
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