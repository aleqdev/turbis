import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
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
          <IonTitle>Сотрудники</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList id="inbox-list">
          <PutWorkerModalController refetch_workers={refetch_workers} />
          {
            (selected_workers?.length > 0 ) ? 
              <DeleteWorkersModalController refetch_workers={refetch_workers} selected_workers={selected_workers}/>
              : ""
          }
          {
            (selected_workers?.length === 1 ) ? 
              <PatchWorkerModalController refetch_workers={refetch_workers} selected_workers={selected_workers}/>
              : ""
          }
        </IonList>
        
        <WorkersList workers={workers!} on_selected_change={set_selected_workers}></WorkersList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
