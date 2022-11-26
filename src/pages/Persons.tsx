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
import { useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { fetch } from '../redux/persons';

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
  const persons = useAppSelector(state => state.persons);
  
  const [selected_persons, set_selected_persons] = useState(Array<Person>);
  const [clear_selection_trigger, set_clear_selection_trigger] = useState(false);

  useEffect(
    () => {
      if (persons.status !== "ok") {
        return
      }

      set_selected_persons(s => s.map((selected_person) => {
        return persons.data.find((w) => w.id === selected_person.id)
      }).filter((w) => w !== undefined).map((w) => w!));
    },
    [persons]
  );

  useEffect(
    () => {
      set_clear_selection_trigger(s => !s);
    },
    [persons]
  )
  
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
                (selected_persons?.length === 1 ) ? 
                  <PatchPersonModalController selected_persons={selected_persons}/>
                  : ""
              }
              {
                (selected_persons?.length > 0 ) ? 
                  <DeletePersonsModalController selected_persons={selected_persons}/>
                  : ""
              }
              <PutPersonModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <PersonsList clear_selection_trigger={clear_selection_trigger} on_selected_change={set_selected_persons} />
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
