import { IonButtons, IonDatetime, IonDatetimeButton, IonHeader, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { TourOrderTurnoverR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { TourOrderTurnoverTable } from '../components/tour_order_turnover/TourOrderTurnoverTable';
import API from '../utils/server';
import { Table } from '../components/table_management/Table';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import { TourOrderTurnoverEntry } from '../interface/tour_order_turnover';
import Tour from '../interface/tour';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  return <Page/>
}

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const turnover = useAppSelector(state => state.tourOrderTurnover);
  const [tours, setTours] = React.useState([] as any);
  const [date_begin, setDate_begin] = React.useState(new Date(0));
  const [date_end, setDate_end] = React.useState(new Date(8640000000000000));
  const date_begin_str = date_begin.toISOString();
  const date_end_str = date_end.toISOString();
  useEffect(() => {
    dispatch(TourOrderTurnoverR.fetch(auth!))
  }, []);
  useEffect(() => {
    const fetchEntries = API.get_with_auth(auth!, `tour?select=*,ordered:tour_order(people_count),selled:tour_order_purchase(people_count),hotel(*,city(*,region(*,country(*)))),feeding_type:tour_feeding_type(*)&ordered.crt_date=gte.${date_begin_str}&ordered.crt_date=lte.${date_end_str}&selled.crt_date=gte.${date_begin_str}&selled.crt_date=lte.${date_end_str}`).then((value) => {setTours((value as any).data)});
  }, [date_begin, date_end]);

  function changeFromDate(ev:any) {
    setDate_begin(new Date(ev.detail.value))
  }
  function changeEndDate(ev:any){
    setDate_end(new Date(ev.detail.value))
  }
  function sum_people_cnt(array:any){
    let value = 0; 
    array.forEach((element:any) => { value = value + element.people_count})
    return value;
  }
  const listColumns = [
    {
      name: "Тур",
      selector: "hotel.name",
      sortable: true,
      wrap: true
    },
    {
      name: "Кол-во заказов",
      selector: "ordered",
      sortable: true,
      wrap: true,
      cell: (ev:any) => `${sum_people_cnt(ev.ordered)}`
    },
    {
      name: "Кол-во продаж",
      selector: "selled",
      sortable: true,
      wrap: true,
      cell: (ev:any) => `${sum_people_cnt(ev.selled)}`
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Отчёт компании</IonTitle>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        { 
          (turnover.status === "ok") ? 
            <IonTitle>
              <h2>
                Количество полученных денежных средств на счету компании: <span style={{color: 'red'}}>{turnover.data.total_money_received}</span> рублей
              </h2>
            </IonTitle>
            : <IonTitle>Загрузка...</IonTitle>
        }
        <br /><br /><IonTitle>Период отчета</IonTitle>
        <IonItem lines='none'>
          <IonLabel position="stacked">Начальная дата выборки (пока дату не менять, будет показана вся информация за все время)</IonLabel>
          <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
          <IonModal keepContentsMounted={true}>
            <IonDatetime onIonChange={ev => changeFromDate(ev)} presentation='date' id="datetime"></IonDatetime>
          </IonModal>
      </IonItem>
      <IonItem lines='none'>
        <IonLabel position="stacked">Конечная дата выборки</IonLabel>
        <IonDatetimeButton datetime="datetime2"></IonDatetimeButton>
        <IonModal keepContentsMounted={true}>
          <IonDatetime onIonChange={ev => changeEndDate(ev)} presentation='date' id="datetime2"></IonDatetime>
        </IonModal>
      </IonItem>
      <IonList>
      {
        (tours.status === "loading") ? <IonTitle>Загрузка...</IonTitle> :
        (tours.status === "err") ? <IonTitle>Ошибка загрузки</IonTitle> :
          <DataTableExtensions
            columns={listColumns as any}
            data={tours ?? tours.data}
            print={true}
            export={true}
            exportHeaders={true}
            filterPlaceholder="Поиск"
          >
          <DataTable
            title="Сведенья об оборотах туров:"
            columns={listColumns as any}
            data={tours ?? tours.data}
            defaultSortFieldId="name"
            pagination
            highlightOnHover
            noDataComponent="Пусто"
            paginationComponentOptions={{rowsPerPageText: "Высота таблицы"}}
          />
         </DataTableExtensions>
      }
    </IonList>
        <IonItem lines='none'>
          <span style={{color: 'gray'}}>Нажмите `Ctrl`+`R` для обновления данных</span>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
