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
import { atLocation } from '../utils/server_url';

const Page: React.FC = () => {
  const [selected_workers, set_selected_workers] = useState(Array<WorkerJoinedFetch>);
  const [clear_selection_trigger, set_clear_selection_trigger] = useState(false);

  const [{ data: workers}, refetch_workers]: [{data?: Array<WorkerJoinedFetch>}, ...any] = useAxios(
    {url: atLocation('db/hotel?join=true'), headers: {"DB-User-Email": "primitive_email@not.even.valid", "DB-User-Password": "primitive_password"}}
  );

  useEffect(
    () => {
      set_selected_workers(s => s.map((selected_worker) => {
        return workers?.find((w) => w.id === selected_worker.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [workers]
  );

  useEffect(
    () => {
      set_clear_selection_trigger(s => !s);
    },
    [workers]
  )
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Сотрудники</IonTitle>
            <IonList>
              {
                (selected_workers?.length === 1 ) ? 
                  <PatchWorkerModalController refetch_workers={refetch_workers} selected_workers={selected_workers}/>
                  : ""
              }
              {
                (selected_workers?.length > 0 ) ? 
                  <DeleteWorkersModalController refetch_workers={refetch_workers} selected_workers={selected_workers}/>
                  : ""
              }
              <PutWorkerModalController refetch_workers={refetch_workers} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <WorkersList clear_selection_trigger={clear_selection_trigger} workers={workers!} on_selected_change={set_selected_workers}></WorkersList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
