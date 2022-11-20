import { IonList, IonTitle } from "@ionic/react";
import axios from "axios";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { RegionJoinedFetch } from "../../interface/region";
import 'react-data-table-component-extensions/dist/index.css';
import { atLocation } from "../../utils/server_url";

const listColumns = [
  {
    name: "Регион",
    selector: "name",
    sortable: true,
    wrap: true,
    cell: (d: RegionJoinedFetch) => d.name === "None" ? "-" : d.name
  },
  {
    name: "Страна",
    selector: "country_name",
    sortable: true,
    wrap: true
  }
];

export interface RegionsListProps {
  on_selected_change: Dispatch<React.SetStateAction<Array<RegionJoinedFetch>>>
}

export const RegionsList: React.FC<RegionsListProps> = (props) => {
  const [regions, set_regions] = React.useState(null as Array<RegionJoinedFetch> | null);

  React.useEffect(() => {
    axios
      .get(atLocation('region?join=true'))
      .then((response) => set_regions(response.data));
  }, [])
  
  return (
    <IonList id="regions-list">
      {
        (regions === null) ?
          <IonTitle>Загрузка...</IonTitle> :
          <DataTableExtensions
          columns={listColumns}
          data={regions}
          print={false}
          export={false}
          filterPlaceholder="Поиск"
          >
            <DataTable
            title="Список регионов:"
            columns={listColumns as any}
            data={regions}
            defaultSortFieldId="name"
            pagination
            highlightOnHover
          />
         </DataTableExtensions>
  
      }
    </IonList>
  );
}