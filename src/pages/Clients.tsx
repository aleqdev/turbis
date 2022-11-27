import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { PutClientModalController } from '../components/client/PutClient';
import { DeleteClientsModalController } from '../components/client/DeleteClients';
import { PatchClientModalController } from '../components/client/PatchClient';
import { ClientsList } from '../components/client/ClientsList';
import { clientsR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(clientsR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const clients = useAppSelector(state => state.clients);
  
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
                (clients.status === "ok" && clients.selected.length === 1) ? 
                  <PatchClientModalController/>
                  : ""
              }
              {
                (clients.status === "ok" && clients.selected.length >= 1) ? 
                  <DeleteClientsModalController/>
                  : ""
              }
              <PutClientModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ClientsList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
