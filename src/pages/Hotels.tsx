import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { PatchHotelModalController } from '../components/hotel/PatchHotel';
import { DeleteHotelsModalController } from '../components/hotel/DeleteHotel';
import { HotelsList } from '../components/hotel/HotelsList';
import { PutHotelModalController } from '../components/hotel/PutHotel';
import { hotelsR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(hotelsR.fetch(auth));

  useEffect(() => {
    dispatch(hotelsR.select([]));
  }, []);

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
                  <PatchHotelModalController/>
                  : ""
              }
              {
                (hotels.status === "ok" && hotels.selected.length >= 1)? 
                  <DeleteHotelsModalController/>
                  : ""
              }
              <PutHotelModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <HotelsList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
