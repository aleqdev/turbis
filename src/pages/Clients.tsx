import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Client from '../interface/client';
import { PutClientModalController } from '../components/client/PutClient';
import { DeleteClientsModalController } from '../components/client/DeleteClients';
import { PatchClientModalController } from '../components/client/PatchClient';
import { ClientsList } from '../components/client/ClientsList';
import { useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { fetch } from '../redux/clients';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const clients = useAppSelector(state => state.clients);
  
  const [selectedClients, setSelectedClients] = useState(Array<Client>);
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(false);

  useEffect(
    () => {
      if (clients.status !== "ok") {
        return
      }

      setSelectedClients(s => s.map((selected_employee) => {
        return clients.data.find((w) => w.id === selected_employee.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [clients]
  );

  useEffect(
    () => {
      setClearSelectionTrigger(s => !s);
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
                (selectedClients?.length === 1 ) ? 
                  <PatchClientModalController selected_clients={selectedClients}/>
                  : ""
              }
              {
                (selectedClients?.length > 0 ) ? 
                  <DeleteClientsModalController selected_clients={selectedClients}/>
                  : ""
              }
              <PutClientModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ClientsList clear_selection_trigger={clearSelectionTrigger} on_selected_change={setSelectedClients} />
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
