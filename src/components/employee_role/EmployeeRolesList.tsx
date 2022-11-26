import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { EmployeeRole } from "../../interface/employee_role";
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
  on_selected_change: Dispatch<React.SetStateAction<Array<EmployeeRole>>>
}

export const EmployeeRolesList: React.FC<EmployeeRolesListProps> = (props) => {
  const employeeRoles = useAppSelector(state => state.employeeRoles);

  return (
    <IonList id="employee-roles-list">
      {
        (employeeRoles.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (employeeRoles.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={employeeRoles.data}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список ролей:"
            columns={listColumns as any}
            data={employeeRoles.data}
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