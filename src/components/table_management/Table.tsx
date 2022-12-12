import { IonList, IonTitle } from "@ionic/react";
import DataTable, { TableColumn, TableProps as NativeTableProps } from "react-data-table-component";
import { useAppSelector } from "../../redux/store";
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { TableManageable } from "../../redux/ctor/table_manageable";
import { useEffect, useMemo, useState } from "react";

export type TableProps<T> = {
  title: string,
  selectRowsCallback?: NativeTableProps<T>["onSelectedRowsChange"],
  columns: TableColumn<T>[],
  expandableRows?: NativeTableProps<T>["expandableRows"]
  expandableRowsComponent?: NativeTableProps<T>["expandableRowsComponent"],
  filter?: string,
} & (
  {
    selector: (state: Parameters<Parameters<typeof useAppSelector>[0]>[0]) => TableManageable<T>,
    selectableRows?: true | undefined
  } | {
    selector: (state: Parameters<Parameters<typeof useAppSelector>[0]>[0]) => T[],
    selectableRows: false
  }
)

export const Table = <T,>(props: TableProps<T>): JSX.Element => {
  let _elements: TableManageable<T> | undefined;
  if (props.selectableRows === true || props.selectableRows === undefined) {
    _elements = useAppSelector(props.selector);
  } else if (props.selectableRows === false) {
    _elements = {data: useAppSelector(props.selector), status: "ok", selected: []};
  }
  let elements: TableManageable<T> = useMemo(() => _elements!, [_elements]);
  console.log(elements);

  const [clearSelectedRowsTrigger, setClearSelectedRowsTrigger] = useState(false);

  useEffect(
    () => {
      if (elements!.status === "ok" && elements!.selected.length === 0) {
        setClearSelectedRowsTrigger(s => !s);
      }
    },
    [elements]
  )

  let data = null;
  if (props.filter !== undefined && elements.status === "ok") {
    const filter = decodeURIComponent(props.filter!);
    data = elements.data.filter((e: T) => JSON.stringify(e).includes(filter));
  }

  return (
    <IonList>
      {
        (elements.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (elements.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={props.columns}
            data={data ?? elements.data}
            print={true}
            export={true}
            exportHeaders={true}
            filterPlaceholder="Поиск"
          >
          <DataTable
            title={props.title}
            columns={props.columns}
            data={data ?? elements.data}
            defaultSortFieldId="name"
            onSelectedRowsChange={props.selectRowsCallback}
            pagination
            selectableRows={props.selectableRows ?? true}
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
