export {}

import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks'
import { ToursList } from '../components/tour/ToursList';
import { PatchTourModalController } from '../components/tour/PatchTour';
import { DeleteToursModalController } from '../components/tour/DeleteTours';
import { PutTourModalController } from '../components/tour/PutTour';
import { AuthProps } from '../interface/props/auth';
import Tour from '../interface/tour';
import API from '../utils/server';
import { useAppSelector } from '../redux/store';

const Page: React.FC = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [selected_tours, set_selected_tours] = useState(Array<Tour>);

  const [{ data: tours }, refetch_tours]: [{data?: Array<Tour>}, ...any] = API.use_hook(
    auth!,
    'tour?select=*,hotel(*,city(*)),feeding_type:tour_feeding_type(*)'
  );

  useEffect(
    () => {
      set_selected_tours(s => s.map((selected_tours) => {
        return tours?.find((w) => w.id === selected_tours.id)
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
                (selected_tours?.length === 1 ) ? 
                  <PatchTourModalController refetch_tours={refetch_tours} selected_tours={selected_tours}/>
                  : ""
              }
              {
                (selected_tours?.length > 0 ) ? 
                  <DeleteToursModalController refetch_tours={refetch_tours} selected_tours={selected_tours}/>
                  : ""
              }
              <PutTourModalController refetch_tours={refetch_tours} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ToursList tours={tours!} on_selected_change={set_selected_tours}></ToursList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
