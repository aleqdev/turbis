import { IonButtons, IonDatetime, IonDatetimeButton, IonHeader, IonItem, IonMenuButton, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { TourOrderTurnoverR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { TourOrderTurnoverTable } from '../components/tour_order_turnover/TourOrderTurnoverTable';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }
  const date_begin = new Date('2022-12-15T19:28:00+03:00');
  const date_end = new Date('2022-12-28T19:28:00+03:00');
  dispatch(TourOrderTurnoverR.fetch(auth, date_begin, date_end));
  console.log('данные', dispatch(TourOrderTurnoverR.fetch(auth)))

  return <Page/>
}

const Page: React.FC = () => {
  const turnover = useAppSelector(state => state.tourOrderTurnover);


  function changeFromDate(ev:any) {
    console.log(ev)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Отчёт по оборотам туров</IonTitle>
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
        <IonDatetime onIonChange={ev => changeFromDate(ev)} presentation="date"></IonDatetime>
      
        <TourOrderTurnoverTable/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
