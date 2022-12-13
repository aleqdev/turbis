import { IonButtons, IonHeader, IonItem, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
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

  dispatch(TourOrderTurnoverR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const turnover = useAppSelector(state => state.tourOrderTurnover);

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
        <TourOrderTurnoverTable/>
        <IonItem lines='none'>
          <span style={{color: 'gray'}}>Нажмите `Ctrl`+`R` для обновления данных</span>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
