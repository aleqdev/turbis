import { useIonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import React, { useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { useAppSelector } from '../../redux/store';

export function PutClientTypeModal(
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
          <IonTitle>Создать тип клиента</IonTitle>
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

export interface PutClientTypeModalControllerProps {
  refetch_client_types: RefetchFunction<any, any>,
}

export const PutClientTypeModalController: React.FC<PutClientTypeModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [present, dismiss] = useIonModal(PutClientTypeModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .post_with_auth(auth!, 'client_type', {
              name: ev.detail.data.name
            })
            .then((_) => {
              props.refetch_client_types();
              presentAlert({
                header: "Тип клиента добавлен",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_client_types();
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
      <IonLabel>Добавить тип клиента</IonLabel>
    </IonButton>
  )
}