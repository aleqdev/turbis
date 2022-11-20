import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'

export function PutWorkerRoleModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const inputName = useRef<HTMLIonInputElement>(null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  function confirm() {
    const name = inputName.current?.value;

    if (name) {
      onDismiss({
        name,
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
          <IonTitle>Создать Роль</IonTitle>
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
          <IonLabel position="stacked">Название</IonLabel>
          <IonInput ref={inputName} type="text" placeholder="Введите название" required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PutWorkerRoleModalControllerProps {
  refetch_worker_roles: RefetchFunction<any, any>,
}

export const PutWorkerRoleModalController: React.FC<PutWorkerRoleModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(PutWorkerRoleModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          axios
            .put("https://api.necrom.ru/worker_role", {
              name: ev.detail.data.name,
              db_user_email: "primitive_email@not.even.valid",
              db_user_password: "primitive_password",
            })
            .then((_) => {
              props.refetch_worker_roles();
              presentAlert({
                header: "Роль добавлена",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_worker_roles();
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: error.response.data,
                buttons: ["Ок"]
              });
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Добавить роль</IonLabel>
    </IonButton>
  )
}