import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { AuthProps } from "../../interface/props/auth";
import { EmployeeRole } from "../../interface/employee_role";

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
  employee_roles: Array<EmployeeRole> | null,
  on_selected_change: Dispatch<React.SetStateAction<Array<EmployeeRole>>>
}

export const EmployeeRolesList: React.FC<EmployeeRolesListProps> = (props) => {
  return (
    <IonList id="employee-roles-list">
      {
        (props.employee_roles === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
            columns={listColumns}
            data={props.employee_roles}
            print={false}
            export={false}
            filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список ролей:"
            columns={listColumns as any}
            data={props.employee_roles}
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