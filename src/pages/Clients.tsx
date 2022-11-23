import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import API from '../utils/server';
import { AuthProps } from '../interface/props/auth';
import Client from '../interface/client';
import { PutClientModalController } from '../components/client/PutClient';
import { DeleteClientsModalController } from '../components/client/DeleteClients';
import { PatchClientModalController } from '../components/client/PatchClient';
import { ClientsList } from '../components/client/ClientsList';

const Page: React.FC<AuthProps> = (props) => {
  const [selected_clients, set_selected_clients] = useState(Array<Client>);
  const [clear_selection_trigger, set_clear_selection_trigger] = useState(false);

  const [{ data: clients }, refetch_clients]: [{data?: Array<Client>}, ...any] = API.use_hook(
    props.auth,
    'client?select=*,person(*),type:client_type(*)'
  );

  useEffect(
    () => {
      set_selected_clients(s => s.map((selected_employee) => {
        return clients?.find((w) => w.id === selected_employee.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [clients]
  );

  useEffect(
    () => {
      set_clear_selection_trigger(s => !s);
    },
    [clients]
  )
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Клиенты</IonTitle>
            <IonList>
              {
                (selected_clients?.length === 1 ) ? 
                  <PatchClientModalController auth={props.auth} refetch_clients={refetch_clients} selected_clients={selected_clients}/>
                  : ""
              }
              {
                (selected_clients?.length > 0 ) ? 
                  <DeleteClientsModalController auth={props.auth} refetch_clients={refetch_clients} selected_clients={selected_clients}/>
                  : ""
              }
              <PutClientModalController auth={props.auth} refetch_clients={refetch_clients} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ClientsList auth={props.auth} clear_selection_trigger={clear_selection_trigger} clients={clients!} on_selected_change={set_selected_clients} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
