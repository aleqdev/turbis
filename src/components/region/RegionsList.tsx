import { IonList, IonTitle } from "@ionic/react";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { AuthProps } from "../../interface/props/auth";
import Region from "../../interface/region";
import { useAppSelector } from "../../redux/store";
import API from "../../utils/server";

const listColumns = [
  {
    name: "Регион",
    selector: "name",
    sortable: true,
    wrap: true,
    cell: (d: Region) => d.name === "None" ? "-" : d.name
  },
  {
    name: "Страна",
    selector: "country.name",
    sortable: true,
    wrap: true
  }
];

export interface RegionsListProps {
  on_selected_change: Dispatch<React.SetStateAction<Array<Region>>>
}

export const RegionsList: React.FC<RegionsListProps> = (props) => {
  const auth = useAppSelector(state => state.auth);

  const [regions, set_regions] = React.useState(null as Array<Region> | null);

  React.useEffect(() => {
    API
      .get_with_auth(auth!, 'region?select=*,country(*)')
      .then((response: any) => set_regions(response.data));
  }, [])
  
  return (
    <IonList id="regions-list">
      {
        (regions === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
          columns={listColumns}
          data={regions}
          print={true}
          export={true}
          exportHeaders={true}
          filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список регионов:"
            columns={listColumns as any}
            data={regions}
            defaultSortFieldId="name"
            pagination
            highlightOnHover
            noDataComponent="Пусто"
            paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
          />
         </DataTableExtensions>
  
      }
    </IonList>
  );
}
