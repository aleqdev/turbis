import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import React, { useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { SelectWithSearchModal } from '../SelectWithSearch';
import Person from '../../interface/person';
import { formatPerson } from '../../utils/fmt';
import ClientType from '../../interface/client_type';
//import { createPutComponent } from '../TableManagement';

export function PutClientModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
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
        person: inputPerson,
        type: inputType
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
          <IonTitle>Добавить клиента</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Создать
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

export interface PutClientModalControllerProps {
  refetch_clients: RefetchFunction<any, any>,
}

export const PutClientModalController: React.FC<PutClientModalControllerProps & AuthProps> = (props) => {
  const [present, dismiss] = useIonModal(PutClientModal, {
    auth: props.auth,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .post_with_auth(props.auth, 'client', {
              person_id: ev.detail.data.person.id,
              type_id: ev.detail.data.type.id
            })
            .then((_) => {
              props.refetch_clients();
              presentAlert({
                header: "Клиент добавлен",
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
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Добавить клиента</IonLabel>
    </IonButton>
  )
}

/*
const PutE = createPutComponent<AuthProps, unknown, unknown>(
  {
    title: "Добавить сотрудника",
    successTitle: "Сотрудник добавлен",
    buttonTitle: "Добавить сотрудника",
    requestPath: "employee",
    modalInit: (params) => {
      const [roles, setRoles] = React.useState(null as Array<EmployeeRole> | null);
      const inputName = useRef<HTMLIonInputElement>(null);
      const inputSurname = useRef<HTMLIonInputElement>(null);
      const inputLastName = useRef<HTMLIonInputElement>(null);
      const inputEmail = useRef<HTMLIonInputElement>(null);
      const inputPhoneNumber = useRef<HTMLIonInputElement>(null);
      const [inputRole, setInputRole] = useState(null as EmployeeRole | null);
      const [errorMessage, setErrorMessage] = useState(null as string | null);

      React.useEffect(() => {
        API
          .get_with_auth(params.props.auth, 'employee_role')
          .then((response: any) => setRoles(response.data));
      }, []);

      return 
    },
    modalPage: () => {},
    modalOnDismiss: (results: any, response: string | undefined) => undefined,
    modalConfirm: (params: any, state: void) => {
      const name = inputName.current?.value;
      const surname = inputSurname.current?.value
      const last_name = inputLastName.current?.value
      const email = inputEmail.current?.value;
      const phone_number = inputPhoneNumber.current?.value;

      if (name && surname && last_name && email && phone_number && inputRole) {
        params.onDismiss({
          name,
          surname,
          last_name,
          email,
          phone_number,
          role: inputRole
        }, 'confirm');
      } else {
        setErrorMessage("Не все поля заполнены!")
      }
    },
    modalPrepareResults: (params) => {

    }
  }
)*/