import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { AuthProps } from '../interface/props/auth';
import API from '../utils/server';
import ClientType from '../interface/client_type';
import { ClientTypesList } from '../components/client_type/ClientTypesList';
import { PutClientTypeModalController } from '../components/client_type/PutClientType';
import { DeleteClientTypesModalController } from '../components/client_type/DeleteClientTypes';
import { PatchClientTypeModalController } from '../components/client_type/PatchClientType';

const Page: React.FC<AuthProps> = (props) => {
  const [selected_client_types, set_selected_client_types] = useState(Array<ClientType>);

  const [{ data: client_types }, refetch_client_types]: [{data?: Array<ClientType>}, ...any] = API.use_hook(
    props.auth,
    'client_type'
  );

  useEffect(
    () => {
      set_selected_client_types(s => s.map((selected_employee_role) => {
        return client_types?.find((w) => w.id === selected_employee_role.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [client_types]
  );
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Типы клиентов</IonTitle>
            <IonList>
              {
                (selected_client_types?.length === 1 ) ? 
                  <PatchClientTypeModalController auth={props.auth} refetch_client_types={refetch_client_types} selected_client_types={selected_client_types}/>
                  : ""
              }
              {
                (selected_client_types?.length > 0 ) ? 
                  <DeleteClientTypesModalController auth={props.auth} refetch_client_types={refetch_client_types} selected_client_types={selected_client_types}/>
                  : ""
              }
              <PutClientTypeModalController auth={props.auth} refetch_client_types={refetch_client_types} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ClientTypesList auth={props.auth} client_types={client_types!} on_selected_change={set_selected_client_types} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
