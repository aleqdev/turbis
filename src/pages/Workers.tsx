import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { WorkerJoinedFetch } from '../interface/worker';
import { PutWorkerModalController } from '../components/PutWorker';
import { PatchWorkerModalController } from '../components/PatchWorker';
import { RemoveWorkersModalController } from '../components/RemoveWorkers';
import { WorkersList } from '../components/WorkersList';

const Page: React.FC = () => {
  const [selected_workers, set_selected_workers] = React.useState(Array<WorkerJoinedFetch>);
  
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
          <PutWorkerModalController />
        </IonList>

        {
          (selected_workers?.length > 0 ) ? 
            <RemoveWorkersModalController selected_workers={selected_workers} set_selected_workers={set_selected_workers}/>
            : ""
        }
        {
          (selected_workers?.length === 1 ) ? 
            <PatchWorkerModalController set_selected_workers={set_selected_workers}/>
            : ""
        }
        
        <WorkersList on_selected_change={set_selected_workers}></WorkersList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
