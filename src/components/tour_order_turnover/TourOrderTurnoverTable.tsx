import { IonLabel, IonText, IonTitle } from "@ionic/react";
import React from "react";
import 'react-data-table-component-extensions/dist/index.css';
import { useAppSelector } from "../../redux/store";
import { Table } from "../table_management/Table";

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
    wrap: true
  },
  {
    name: "Кол-во продаж",
    selector: "selled",
    sortable: true,
    wrap: true
  },
];

export const TourOrderTurnoverTable: React.FC = () => {
  const turnover2 = useAppSelector(state => state.tourOrderTurnover);
  let sum_money = 0
  if (turnover2.status == 'ok') {
    turnover2.data.entries.forEach((element) => (sum_money = sum_money + element.tour?.price! * element.selled))
  }
  return (
    <><br /><br />
    {
      (sum_money === 0) ? <IonTitle><h2>Количество денежных средств на счете компании = <span style={{color: 'red'}}>Загружается...</span> рублей</h2></IonTitle>
      :
      <IonTitle><h2>Количество денежных средств на счете компании = <span style={{color: 'red'}}>{sum_money}</span> рублей</h2></IonTitle>
    }
    <br />
    <Table 
      title="Сведенья об оборотах туров:"
      selector={state => {
        const turnover = state.tourOrderTurnover;
        return turnover.status === "ok" ? turnover.data.entries : []
      }}
      columns={listColumns as any}
      selectableRows={false}
    />
    </>
  );
}
