
import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { ToursList } from '../components/tour/ToursList';
import { PatchTourModalController } from '../components/tour/PatchTour';
import { DeleteToursModalController } from '../components/tour/DeleteTours';
import { PutTourModalController } from '../components/tour/PutTour';
import Tour from '../interface/tour';
import { toursR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(toursR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const tours = useAppSelector(state => state.tours);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Туры</IonTitle>
            <IonList>
              {
                (tours.status === "ok" && tours.selected.length === 1) ? 
                  <PatchTourModalController/>
                  : ""
              }
              {
                (tours.status === "ok" && tours.selected.length >= 1) ? 
                  <DeleteToursModalController/>
                  : ""
              }
              <PutTourModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ToursList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
