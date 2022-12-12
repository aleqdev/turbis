import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { PatchOrderModalController } from '../components/tour_order/PatchOrder';
import { DeleteTourOrdersModalController } from '../components/tour_order/DeleteOrders';
import { OrdersList } from '../components/tour_order/OrdersList';
import { PutOrderModalController } from '../components/tour_order/PutOrder';
import { tourOrdersR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { RouteComponentProps } from 'react-router';

const MetaPage: React.FC<{
  params: {
    filter?: string;
  }
}> = ({ params }) => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(tourOrdersR.fetch(auth));

  useEffect(() => {
    dispatch(tourOrdersR.select([]));
  }, []);

  return <Page filter={params.filter} />
}

const Page: React.FC<{ filter?: string}> = ({ filter }) => {
  const tourOrders = useAppSelector(state => state.tourOrders);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Заказы туров</IonTitle>
            <IonList>
              {
                (tourOrders.status === "ok" && tourOrders.selected.length === 1) ? 
                  <PatchOrderModalController/>
                  : ""
              }
              {
                (tourOrders.status === "ok" && tourOrders.selected.length >= 1)? 
                  <DeleteTourOrdersModalController/>
                  : ""
              }
              <PutOrderModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <OrdersList filter={filter}/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
