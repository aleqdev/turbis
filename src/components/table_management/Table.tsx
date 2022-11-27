import { IonList, IonTitle } from "@ionic/react";
import DataTable, { TableColumn, TableProps as NativeTableProps } from "react-data-table-component";
import { useAppSelector } from "../../redux/store";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { TableManageable } from "../../redux/ctor/table_manageable";
import { useEffect, useState } from "react";

export type TableProps<T> = {
  title: string,
  selector: (state: Parameters<Parameters<typeof useAppSelector>[0]>[0]) => TableManageable<T>,
  selectRowsCallback: NativeTableProps<T>["onSelectedRowsChange"],
  columns: TableColumn<T>[],
  expandableRows?: NativeTableProps<T>["expandableRows"]
  expandableRowsComponent?: NativeTableProps<T>["expandableRowsComponent"]
}

export const Table = <T,>(props: TableProps<T>): JSX.Element => {
  const elements = useAppSelector(props.selector);
  const [clearSelectedRowsTrigger, setClearSelectedRowsTrigger] = useState(false);

  useEffect(
    () => {
      if (elements.status === "ok" && elements.selected.length === 0) {
        setClearSelectedRowsTrigger(s => !s);
      }
    },
    [elements]
  )

  return (
    <IonList>
      {
        (elements.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (elements.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={props.columns}
            data={elements.data}
            print={true}
            export={true}
            exportHeaders={true}
            filterPlaceholder="Поиск"
          >
          <DataTable
            title={props.title}
            columns={props.columns}
            data={elements.data}
            defaultSortFieldId="name"
            onSelectedRowsChange={props.selectRowsCallback}
            pagination
            selectableRows
            highlightOnHover
            clearSelectedRows={clearSelectedRowsTrigger}
            noDataComponent="Пусто"
            paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
            expandableRows={props.expandableRows}
            expandableRowsComponent={props.expandableRowsComponent}
          />
         </DataTableExtensions>
      }
    </IonList>
  )
}
