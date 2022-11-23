export {}
/*
import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { EmployeeJoinedFetch } from '../interface/employee';
import { PutWorkerModalController } from '../components/employee/PutEmployee';
import { PatchEmployeesModalController } from '../components/employee/PatchEmployee';
import { DeleteEmployeesModalController } from '../components/employee/DeleteEmployees';
import { WorkersList } from '../components/employee/EmployeesList';
import useAxios from 'axios-hooks'
import { ToursList } from '../components/tour/ToursList';
import { PatchTourModalController } from '../components/tour/PatchTour';
import { DeleteToursModalController } from '../components/tour/DeleteTours';
import { PutTourModalController } from '../components/tour/PutTour';
import { AuthProps } from '../interface/props/auth';

const Page: React.FC<AuthProps> = (props) => {
  const [selected_tours, set_selected_tours] = useState(Array<EmployeeJoinedFetch>);

  const [{ data: tours }, refetch_tours]: [{data?: Array<EmployeeJoinedFetch>}, ...any] = useAxios(
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
                  <PatchTourModalController auth={props.auth} refetch_workers={refetch_tours} selected_workers={selected_tours}/>
                  : ""
              }
              {
                (selected_tours?.length > 0 ) ? 
                  <DeleteToursModalController auth={props.auth} refetch_workers={refetch_tours} selected_workers={selected_tours}/>
                  : ""
              }
              <PutTourModalController auth={props.auth} refetch_workers={refetch_tours} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ToursList auth={props.auth} workers={tours!} on_selected_change={set_selected_tours}></ToursList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
*/