import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ClientType from '../interface/client_type';
import { ClientTypesList } from '../components/client_type/ClientTypesList';
import { PutClientTypeModalController } from '../components/client_type/PutClientType';
import { DeleteClientTypesModalController } from '../components/client_type/DeleteClientTypes';
import { PatchClientTypeModalController } from '../components/client_type/PatchClientType';
import { useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { fetch } from '../redux/client_types';

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
  const clientTypes = useAppSelector(state => state.clientTypes);

  const [selectedClientTypes, setSelectedClientTypes] = useState(Array<ClientType>);

  useEffect(
    () => {
      if (clientTypes.status !== "ok") {
        return
      }

      setSelectedClientTypes(s => s.map((selected_employee_role) => {
        return clientTypes.data.find((w) => w.id === selected_employee_role.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [clientTypes]
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
                (selectedClientTypes?.length === 1 ) ? 
                  <PatchClientTypeModalController selected_client_types={selectedClientTypes}/>
                  : ""
              }
              {
                (selectedClientTypes?.length > 0 ) ? 
                  <DeleteClientTypesModalController selected_client_types={selectedClientTypes}/>
                  : ""
              }
              <PutClientTypeModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ClientTypesList on_selected_change={setSelectedClientTypes} />
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
