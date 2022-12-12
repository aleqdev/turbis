import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
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
  console.log('good', dispatch(TourOrderTurnoverR.fetch(auth)))

  return <Page/>
}

const Page: React.FC = () => {
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
        <TourOrderTurnoverTable/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
