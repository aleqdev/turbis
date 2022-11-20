import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks'
import { WorkerRole } from '../interface/worker_role';
import { PutWorkerRoleModalController } from '../components/worker_role/PutWorkerRole';
import { PatchWorkerRoleModalController } from '../components/worker_role/PatchWorkerRole';
import { WorkerRolesList } from '../components/worker_role/WorkerRolesList';
import { DeleteWorkerRolesModalController } from '../components/worker_role/DeleteWorkerRoles';

const Page: React.FC = () => {
  const [selected_worker_roles, set_selected_worker_roles] = useState(Array<WorkerRole>);

  const [{ data: worker_roles }, refetch_worker_roles]: [{data?: Array<WorkerRole>}, ...any] = useAxios(
    'https://api.necrom.ru/worker_role'
  );

  useEffect(
    () => {
      set_selected_worker_roles(s => s.map((selected_worke_role) => {
        return worker_roles?.find((w) => w.id === selected_worke_role.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [worker_roles]
  );
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Роли</IonTitle>
            <IonList>
              {
                (selected_worker_roles?.length === 1 ) ? 
                  <PatchWorkerRoleModalController refetch_worker_roles={refetch_worker_roles} selected_worker_roles={selected_worker_roles}/>
                  : ""
              }
              {
                (selected_worker_roles?.length > 0 ) ? 
                  <DeleteWorkerRolesModalController refetch_worker_roles={refetch_worker_roles} selected_worker_roles={selected_worker_roles}/>
                  : ""
              }
              <PutWorkerRoleModalController refetch_worker_roles={refetch_worker_roles} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <WorkerRolesList worker_roles={worker_roles!} on_selected_change={set_selected_worker_roles} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
