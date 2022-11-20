import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { WorkerRole } from '../../interface/worker_role';
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'

export function PatchWorkerRoleModal(
  {selected_worker_roles, onDismiss}: {
    selected_worker_roles: Array<WorkerRole>,
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const worker_role = selected_worker_roles[0];

  const inputName = useRef<HTMLIonInputElement>(null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  function confirm() {
    const name = inputName.current?.value;

    if (name) {
      onDismiss({
        id: worker_role.id,
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
          <IonTitle>Изменить Роль</IonTitle>
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
          <IonLabel position="stacked">Название</IonLabel>
          <IonInput ref={inputName} type="text" placeholder="Введите название" value={worker_role.name} required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PatchWorkerRoleModalControllerProps {
  refetch_worker_roles: RefetchFunction<any, any>,
  selected_worker_roles: Array<WorkerRole>,
}

export const PatchWorkerRoleModalController: React.FC<PatchWorkerRoleModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(PatchWorkerRoleModal, {
    selected_worker_roles: props.selected_worker_roles,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          axios
            .patch(`https://api.necrom.ru/worker_role/${ev.detail.data.id}`, {
              name: ev.detail.data.name,
              db_user_email: "primitive_email@not.even.valid",
              db_user_password: "primitive_password",
            })
            .then((_) => {
              props.refetch_worker_roles();
              presentAlert({
                header: "Данные роли изменены",
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
    <IonButton routerDirection="none" color="secondary" onClick={openModal}>
      <IonLabel>Изменить роль</IonLabel>
    </IonButton>
  )
}