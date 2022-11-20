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
  const [selected_workers, set_selected_workers] = useState(Array<WorkerJoinedFetch>);

  const [{ data: workers }, refetch_workers]: [{data?: Array<WorkerJoinedFetch>}, ...any] = useAxios(
    'https://api.necrom.ru/worker?join=true'
  );

  useEffect(
    () => {
      set_selected_workers(s => s.map((selected_worker) => {
        return workers?.find((w) => w.id === selected_worker.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [workers]
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
                (selected_workers?.length === 1 ) ? 
                  <PatchTourModalController refetch_workers={refetch_workers} selected_workers={selected_workers}/>
                  : ""
              }
              {
                (selected_workers?.length > 0 ) ? 
                  <DeleteToursModalController refetch_workers={refetch_workers} selected_workers={selected_workers}/>
                  : ""
              }
              <PutTourModalController refetch_workers={refetch_workers} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ToursList workers={workers!} on_selected_change={set_selected_workers}></ToursList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
