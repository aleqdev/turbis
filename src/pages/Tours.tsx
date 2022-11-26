
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
import { useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { fetch } from '../redux/tours';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const tours = useAppSelector(state => state.tours);
  
  const [selectedTours, setSelectedTours] = useState(Array<Tour>);

  useEffect(
    () => {
      if (tours.status !== "ok") {
        return
      }

      setSelectedTours(s => s.map((selected_tours) => {
        return tours.data.find((w) => w.id === selected_tours.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [tours]
  );
  
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
                (selectedTours?.length === 1 ) ? 
                  <PatchTourModalController selected_tours={selectedTours}/>
                  : ""
              }
              {
                (selectedTours?.length > 0 ) ? 
                  <DeleteToursModalController selected_tours={selectedTours}/>
                  : ""
              }
              <PutTourModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ToursList on_selected_change={setSelectedTours}></ToursList>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
