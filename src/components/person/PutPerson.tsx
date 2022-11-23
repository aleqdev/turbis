import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import React, { useRef, useState } from 'react'
import { EmployeeRole } from '../../interface/employee_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';

export function PutPersonModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const inputName = useRef<HTMLIonInputElement>(null);
  const inputSurname = useRef<HTMLIonInputElement>(null);
  const inputLastName = useRef<HTMLIonInputElement>(null);
  const inputEmail = useRef<HTMLIonInputElement>(null);
  const inputPhoneNumber = useRef<HTMLIonInputElement>(null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  function confirm() {
    const name = inputName.current?.value;
    const surname = inputSurname.current?.value
    const last_name = inputLastName.current?.value
    const email = inputEmail.current?.value;
    const phone_number = inputPhoneNumber.current?.value;

    if (name && surname && last_name && email && phone_number) {
      onDismiss({
        name,
        surname,
        last_name,
        email,
        phone_number,
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
          <IonTitle>Добавить контактное лицо</IonTitle>
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
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PutPersonModalControllerProps {
  refetch_persons: RefetchFunction<any, any>,
}

export const PutPersonModalController: React.FC<PutPersonModalControllerProps & AuthProps> = (props) => {
  const [present, dismiss] = useIonModal(PutPersonModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .post_with_auth(props.auth, 'person', {
              name: ev.detail.data.name,
              surname: ev.detail.data.surname,
              last_name: ev.detail.data.last_name,
              email: ev.detail.data.email,
              phone_number: ev.detail.data.phone_number,
            })
            .then((_) => {
              props.refetch_persons();
              presentAlert({
                header: "Контактное лицо добавлено",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_persons();
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