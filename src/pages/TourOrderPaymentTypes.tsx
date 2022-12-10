import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { tourOrderPaymentTypesR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { PatchTourOrderPaymentTypeModalController } from '../components/tour_order_payment_type/PatchTourOrderPaymentType';
import { DeleteTourOrderPaymentTypeModalController } from '../components/tour_order_payment_type/DeleteTourOrderPaymentType';
import { PutTourOrderPaymentTypeModalController } from '../components/tour_order_payment_type/PutTourOrderPaymentType';
import { TourOrderPaymentTypesList } from '../components/tour_order_payment_type/TourOrderPaymentTypesList';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(tourOrderPaymentTypesR.fetch(auth));

  useEffect(() => {
    dispatch(tourOrderPaymentTypesR.select([]));
  }, []);

  return <Page/>
}

const Page: React.FC = () => {
  const tourOrderPaymentTypes = useAppSelector(state => state.tourOrderPaymentTypes);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Типы оплаты заказов туров</IonTitle>
            <IonList>
              {
                (tourOrderPaymentTypes.status === "ok" && tourOrderPaymentTypes.selected.length === 1) ? 
                  <PatchTourOrderPaymentTypeModalController/>
                  : ""
              }
              {
                (tourOrderPaymentTypes.status === "ok" && tourOrderPaymentTypes.selected.length >= 1) ? 
                  <DeleteTourOrderPaymentTypeModalController/>
                  : ""
              }
              <PutTourOrderPaymentTypeModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <TourOrderPaymentTypesList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
