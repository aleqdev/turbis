import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { WorkerRole } from '../../interface/worker_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { atLocation } from '../../utils/server_url';
import { process_error_hint } from '../../utils/process_erros_hints';

export function PutWorkerModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [roles, setRoles] = React.useState(null as Array<WorkerRole> | null);
  const inputName = useRef<HTMLIonInputElement>(null);
  const inputSurname = useRef<HTMLIonInputElement>(null);
  const inputLastName = useRef<HTMLIonInputElement>(null);
  const inputEmail = useRef<HTMLIonInputElement>(null);
  const inputPhoneNumber = useRef<HTMLIonInputElement>(null);
  const [inputRole, setInputRole] = useState(null as WorkerRole | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  React.useEffect(() => {
    axios
      .get(atLocation('worker_role'))
      .then((response) => setRoles(response.data));
  }, [])

  function confirm() {
    const name = inputName.current?.value;
    const surname = inputSurname.current?.value
    const last_name = inputLastName.current?.value
    const email = inputEmail.current?.value;
    const phone_number = inputPhoneNumber.current?.value;

    if (name && surname && last_name && email && phone_number && inputRole) {
      onDismiss({
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
          <IonTitle>Создать контактное лицо</IonTitle>
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
          <IonLabel position="stacked">Имя</IonLabel>
          <IonInput ref={inputName} clearInput={true} type="text" placeholder="Введите имя" required/>
          <IonLabel position="stacked">Фамилия</IonLabel>
          <IonInput ref={inputSurname} clearInput={true} type="text" placeholder="Введите фамилию" required/>
          <IonLabel position="stacked">Отчество</IonLabel>
          <IonInput ref={inputLastName} clearInput={true} type="text" placeholder="Введите отчество" required/>
          <IonLabel position="stacked">Телефон</IonLabel>
          <IonInput pattern="email" type="email" ref={inputPhoneNumber} clearInput={true} placeholder="Введите телефон" required/>
          <IonLabel position="stacked">Почта</IonLabel>
          <IonInput ref={inputEmail} clearInput={true} type="email" placeholder="Введите почту" required/>
          <IonLabel position="stacked" >Роль</IonLabel>
          <IonSelect placeholder="Выбрать" onIonChange={(ev) => setInputRole(ev.target.value)}>
            {
              roles ? 
                roles.map((element) => {
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

export interface PutWorkerModalControllerProps {
  refetch_workers: RefetchFunction<any, any>,
}

export const PutWorkerModalController: React.FC<PutWorkerModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(PutWorkerModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          axios
            .put(atLocation('worker'), {
              name: ev.detail.data.name,
              surname: ev.detail.data.surname,
              last_name: ev.detail.data.last_name,
              email: ev.detail.data.email,
              phone_number: ev.detail.data.phone_number,
              role_id: ev.detail.data.role.id,
              db_user_email: "primitive_email@not.even.valid",
              db_user_password: "primitive_password",
            })
            .then((_) => {
              props.refetch_workers();
              presentAlert({
                header: "Сотрудник добавлен",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_workers();
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
      <IonLabel>Добавить контактное лицо</IonLabel>
    </IonButton>
  )
}