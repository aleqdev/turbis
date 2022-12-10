import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { tourOrderPaymentsR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { PatchTourOrderPaymentModalController } from '../components/tour_order_payment/PatchTourOrderPayment';
import { DeleteTourOrderPaymentModalController } from '../components/tour_order_payment/DeleteTourOrderPayment';
import { PutTourOrderPaymentModalController } from '../components/tour_order_payment/PutTourOrderPayment';
import { TourOrderPaymentsList } from '../components/tour_order_payment/TourOrderPaymentsList';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(tourOrderPaymentsR.fetch(auth));

  useEffect(() => {
    dispatch(tourOrderPaymentsR.select([]));
  }, []);

  return <Page/>
}

const Page: React.FC = () => {
  const tourOrderPayments = useAppSelector(state => state.tourOrderPayments);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Записи оплаты заказов туров</IonTitle>
            <IonList>
              {/* {
                (tourOrderPayments.status === "ok" && tourOrderPayments.selected.length === 1) ? 
                  <PatchTourOrderPaymentModalController/>
                  : ""
              } */}
              {
                (tourOrderPayments.status === "ok" && tourOrderPayments.selected.length >= 1) ? 
                  <DeleteTourOrderPaymentModalController/>
                  : ""
              }
              <PutTourOrderPaymentModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <TourOrderPaymentsList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
