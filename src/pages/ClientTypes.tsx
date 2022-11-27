import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { ClientTypesList } from '../components/client_type/ClientTypesList';
import { PutClientTypeModalController } from '../components/client_type/PutClientType';
import { DeleteClientTypesModalController } from '../components/client_type/DeleteClientTypes';
import { PatchClientTypeModalController } from '../components/client_type/PatchClientType';
import { clientTypesR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(clientTypesR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const clientTypes = useAppSelector(state => state.clientTypes);
  
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
                (clientTypes.status === "ok" && clientTypes.selected.length === 1) ? 
                  <PatchClientTypeModalController/>
                  : ""
              }
              {
                (clientTypes.status === "ok" && clientTypes.selected.length >= 1) ? 
                  <DeleteClientTypesModalController/>
                  : ""
              }
              <PutClientTypeModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ClientTypesList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
