import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import API from '../utils/server';
import { AuthProps } from '../interface/props/auth';
import Person from '../interface/person';
import { DeletePersonsModalController } from '../components/person/DeletePersons';
import { PersonsList } from '../components/person/PersonsList';
import { PutPersonModalController } from '../components/person/PutPerson';
import { PatchPersonModalController } from '../components/person/PatchPerson';
import { useAppSelector } from '../redux/store';

const Page: React.FC = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [selected_persons, set_selected_persons] = useState(Array<Person>);
  const [clear_selection_trigger, set_clear_selection_trigger] = useState(false);

  const [{ data: persons }, refetch_persons]: [{data?: Array<Person>}, ...any] = API.use_hook(
    auth!,
    'person'
  );

  useEffect(
    () => {
      set_selected_persons(s => s.map((selected_person) => {
        return persons?.find((w) => w.id === selected_person.id)
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
                  <PatchPersonModalController refetch_persons={refetch_persons} selected_persons={selected_persons}/>
                  : ""
              }
              {
                (selected_persons?.length > 0 ) ? 
                  <DeletePersonsModalController refetch_persons={refetch_persons} selected_persons={selected_persons}/>
                  : ""
              }
              <PutPersonModalController refetch_persons={refetch_persons} />
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <PersonsList clear_selection_trigger={clear_selection_trigger} persons={persons!} on_selected_change={set_selected_persons} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
