import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { WorkerJoinedFetch } from '../interface/worker';
import { PutWorkerModalController } from '../components/worker/PutWorker';
import { PatchWorkerModalController } from '../components/worker/PatchWorker';
import { DeleteWorkersModalController } from '../components/worker/DeleteWorkers';
import { WorkersList } from '../components/worker/WorkersList';
import useAxios from 'axios-hooks'
import { ToursList } from '../components/tour/ToursList';
import { PatchTourModalController } from '../components/tour/PatchTour';
import { DeleteToursModalController } from '../components/tour/DeleteTours';
import { PutTourModalController } from '../components/tour/PutTour';

const Page: React.FC = () => {
  const [selected_tours, set_selected_tours] = useState(Array<WorkerJoinedFetch>);

  const [{ data: tours }, refetch_tours]: [{data?: Array<WorkerJoinedFetch>}, ...any] = useAxios(
    'https://api.necrom.ru/worker?join=true'
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
                  <PatchTourModalController refetch_workers={refetch_tours} selected_workers={selected_tours}/>
                  : ""
              }
              {
                (selected_tours?.length > 0 ) ? 
                  <DeleteToursModalController refetch_workers={refetch_tours} selected_workers={selected_tours}/>
                  : ""
              }
              <PutTourModalController refetch_workers={refetch_tours} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ToursList workers={tours!} on_selected_change={set_selected_tours}></ToursList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
