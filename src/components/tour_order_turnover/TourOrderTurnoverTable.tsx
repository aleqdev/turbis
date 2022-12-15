import { IonCol, IonGrid, IonItem, IonRow } from "@ionic/react";
import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { TourOrderTurnoverEntry } from "../../interface/tour_order_turnover";
import { formatDate } from "../../utils/fmt";
import { Table } from "../table_management/Table";
import dayjs from "dayjs";
import Plot from 'react-plotly.js';

const listColumns = [
  {
    name: "Тур",
    selector: "tour.hotel.name",
    sortable: true,
    wrap: true
  },
  {
    name: "Кол-во заказов",
    selector: "ordered",
    sortable: true,
    wrap: true,
    cell: (e: TourOrderTurnoverEntry) => `${e.ordered.reduce((value, el) => value + el.people_count, 0)}`
  },
  {
    name: "Кол-во продаж",
    selector: "selled",
    sortable: true,
    wrap: true,
    cell: (e: TourOrderTurnoverEntry) => `${e.selled.reduce((value, el) => value + el.people_count, 0)}`
  },
];

function getDiaram(e: TourOrderTurnoverEntry) {
  const dates = [
    dayjs(),
    dayjs().subtract(1, 'month'),
    dayjs().subtract(2, 'month'),
    dayjs().subtract(3, 'month'),
    dayjs().subtract(4, 'month'),
    dayjs().subtract(5, 'month'),
    dayjs().subtract(6, 'month'),
    dayjs().subtract(7, 'month'),
    dayjs().subtract(8, 'month'),
    dayjs().subtract(9, 'month'),
    dayjs().subtract(10, 'month'),
    dayjs().subtract(11, 'month'),
    dayjs().subtract(12, 'month'),
  ].reverse();

  const dataOrdered = dates.map(date => {
    return e.ordered
      .filter(e => e.crt_date >= date.subtract(1, 'month').toDate() && e.crt_date < date.toDate())
      .reduce((value, el) => value + el.people_count, 0);
  });

  const dataSelled = dates.map(date => {
    return e.selled
      .filter(e => e.crt_date >= date.subtract(1, 'month').toDate() && e.crt_date < date.toDate())
      .reduce((value, el) => value + el.people_count, 0);
  });

  return (
    <Plot 
      data={[
        {
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'red'},
          name: 'Заказано',
          x: dates.map(e => formatDate(e.toDate())),
          y: dataOrdered,
        },
        {
          type: 'scatter',
          mode: 'lines+markers',
          marker: {color: 'blue'},
          name: 'Продано',
          x: dates.map(e => formatDate(e.toDate())), 
          y: dataSelled,
        },
      ]}
      layout={{
        title: 'График продаж/заказов по месяцам',
      }}
    />
  );
}

const ExpandedElement = ({ data }: { data: any}) => {
  return (
    <IonGrid>
      <IonGrid>
        <IonRow>
          <IonCol>{'ID:'}</IonCol>
          <IonCol size='10'>{data.tour_id}</IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-center">
          <IonCol size='7'>
            {getDiaram(data)}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonGrid>
  );
}

export const TourOrderTurnoverTable: React.FC = () => {
  return (
    <Table 
      title="Сведенья об оборотах туров:"
      selector={state => {
        const turnover = state.tourOrderTurnover;
        return turnover.status === "ok" ? turnover.data.entries : []
      }}
      columns={listColumns as any}
      selectableRows={false}
      expandableRows={true}
      expandableRowsComponent={ExpandedElement}
    />

  );
}
