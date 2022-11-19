import { IonList, IonTitle } from "@ionic/react";
import axios from "axios";
import React, { Dispatch } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { RegionJoinedFetch } from "../interface/region";

const listColumns = [
  {
    name: "Регион",
    selector: (row: RegionJoinedFetch) => row.name,
    sortable: true,
    wrap: true
  },
  {
    name: "Страна",
    selector: (row: RegionJoinedFetch) => row.country_name,
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
      .get("https://api.necrom.ru/region?join=true")
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
          >
            <DataTable
            title="Список регионов:"
            columns={listColumns}
            data={regions}
            // noHeader={true}
            defaultSortFieldId="name"
            // onSelectedRowsChange={({selectedRows}) => props.on_selected_change(selectedRows)}
            pagination
            // selectableRows
            highlightOnHover
          />
         </DataTableExtensions>
  
      }
    </IonList>
  );
}