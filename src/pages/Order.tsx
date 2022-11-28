import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { PatchOrderModalController } from '../components/order/PatchOrder';
import { DeleteOrdersModalController } from '../components/order/DeleteOrders';
import { OrdersList } from '../components/order/OrderList';
import { PutOrderModalController } from '../components/order/PutOrder';
import { hotelsR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(hotelsR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const hotels = useAppSelector(state => state.hotels);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Отели</IonTitle>
            <IonList>
              {
                (hotels.status === "ok" && hotels.selected.length === 1) ? 
                  <PatchOrderModalController/>
                  : ""
              }
              {
                (hotels.status === "ok" && hotels.selected.length >= 1)? 
                  <DeleteOrdersModalController/>
                  : ""
              }
              <PutOrderModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <OrdersList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
