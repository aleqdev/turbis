import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { tourOrderPurchasesR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { TourOrderPurchasesList } from '../components/tour_order_purchase/TourOrderPurchasesList';
import { PutTourOrderPurchaseModalController } from '../components/tour_order_purchase/PutTourOrderPurchase';
import { DeleteTourOrderPurchaseModalController } from '../components/tour_order_purchase/DeleteTourOrderPurchase';
import { PatchTourOrderPurchaseModalController } from '../components/tour_order_purchase/PatchTourOrderPurchase';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(tourOrderPurchasesR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const tourOrderPurchases = useAppSelector(state => state.tourOrderPurchases);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Записи продажи заказов туров</IonTitle>
            <IonList>
              {
                (tourOrderPurchases.status === "ok" && tourOrderPurchases.selected.length === 1) ? 
                  <PatchTourOrderPurchaseModalController/>
                  : ""
              }
              {
                (tourOrderPurchases.status === "ok" && tourOrderPurchases.selected.length >= 1) ? 
                  <DeleteTourOrderPurchaseModalController/>
                  : ""
              }
              <PutTourOrderPurchaseModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <TourOrderPurchasesList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
