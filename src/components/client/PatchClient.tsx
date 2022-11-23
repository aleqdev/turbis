import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useMemo, useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { Person } from '../../interface/person';
import { SelectWithSearchModal } from '../SelectWithSearch';
import { formatPerson } from '../../utils/fmt';
import Client from '../../interface/client';
import ClientType from '../../interface/client_type';

export function PatchClientModal(
  {auth, selected_clients, onDismiss}: AuthProps & {
    selected_clients: Array<Client>,
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const client = selected_clients[0];

  const [types, setTypes] = React.useState(null as Array<ClientType> | null);
  const [persons, setPersons] = React.useState(null as Array<Person> | null);
  const [inputType, setInputType] = useState(null as ClientType | null);
  const [inputPerson, setInputPerson] = useState(null as Person | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  const [presentPersonChoice, dismissPersonChoice] = useIonModal(SelectWithSearchModal, {
    elements: persons,
    title: "Выберите контактное лицо",
    formatter: formatPerson,
    sorter: (e: Person, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.name.toLowerCase().includes(element) + 10 * +(e.name.toLowerCase() === element) + 
          +e.surname.toLowerCase().includes(element) + 10 * +(e.surname.toLowerCase() === element) +
          +e.last_name.toLowerCase().includes(element) + 10 * +(e.last_name.toLowerCase() === element);
      }, 0);
    },
    keyer: (e: Person) => e.id,
    onDismiss: (data: object | null, role: string) => dismissPersonChoice(data, role),
  });

  function openPersonSelectModal() {
    presentPersonChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputPerson(ev.detail.data.value);
        }
      },
    });
  }

  React.useEffect(() => {
    API
      .get_with_auth(auth, 'client_type')
      .then((response: any) => setTypes(response.data));
  }, []);

  React.useEffect(() => {
    API
      .get_with_auth(auth, 'person')
      .then((response: any) => setPersons(response.data));
  }, []);

  function confirm() {
    if (inputType && inputPerson) {
      onDismiss({
        id: client.id,
        type: inputType,
        person: inputPerson
      }, 'confirm');
    } else {
      setErrorMessage("Не все поля заполнены!")
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Изменить клиента</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Изменить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked" >Контактное лицо</IonLabel>
          <IonButton disabled={persons === null} onClick={() => openPersonSelectModal()}>
            {persons === null ? "Загрузка..." : (inputPerson === null ? "Выбрать" : formatPerson(inputPerson))}
          </IonButton>
          <IonLabel position="stacked" >Тип</IonLabel>
          <IonSelect placeholder="Выбрать" onIonChange={(ev) => setInputType(ev.target.value)}>
            {
              types ? 
                types.map((element) => {
                  return <IonSelectOption key={element.name} value={element}>{element.name}</IonSelectOption>
                }) :
                <IonText>Загрузка...</IonText>
            }
          </IonSelect>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PatchClientModalControllerProps {
  refetch_clients: RefetchFunction<any, any>,
  selected_clients: Array<Client>,
}

export const PatchClientModalController: React.FC<PatchClientModalControllerProps & AuthProps> = (props) => {
  const [present, dismiss] = useIonModal(PatchClientModal, {
    auth: props.auth,
    selected_clients: props.selected_clients,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .patch_with_auth(props.auth, `client?id=eq.${ev.detail.data.id}`, {
              type_id: ev.detail.data.type.id,
              person_id: ev.detail.data.person.id,
            })
            .then((_) => {
              props.refetch_clients();
              presentAlert({
                header: "Данные клиента изменены",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_clients();
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: process_error_hint(error.response.data),
                buttons: ["Ок"]
              });
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" color="secondary" onClick={openModal}>
      <IonLabel>Изменить клиента</IonLabel>
    </IonButton>
  )
}