import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Person from '../interface/person';
import { DeletePersonsModalController } from '../components/person/DeletePersons';
import { PersonsList } from '../components/person/PersonsList';
import { PutPersonModalController } from '../components/person/PutPerson';
import { PatchPersonModalController } from '../components/person/PatchPerson';
import { personsR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(personsR.fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const persons = useAppSelector(state => state.persons);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines="none">
            <IonTitle>Контактные лица</IonTitle>
            <IonList>
              {
                (persons.status === "ok" && persons.selected.length === 1) ? 
                  <PatchPersonModalController/>
                  : ""
              }
              {
                (persons.status === "ok" && persons.selected.length >= 1) ? 
                  <DeletePersonsModalController/>
                  : ""
              }
              <PutPersonModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <PersonsList/>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
