import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import ClientType from '../../interface/client_type';
import { useAppSelector } from '../../redux/store';

export function PatchEmployeeRoleModal(
  {selected_client_types, onDismiss}: {
    selected_client_types: Array<ClientType>,
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const client_type = selected_client_types[0];

  const inputName = useRef<HTMLIonInputElement>(null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  function confirm() {
    const name = inputName.current?.value;

    if (name) {
      onDismiss({
        id: client_type.id,
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
          <IonTitle>Изменить тип клиента</IonTitle>
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
          <IonInput ref={inputName} type="text" placeholder="Введите название" value={client_type.name} required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PatchClientTypeModalControllerProps {
  refetch_client_types: RefetchFunction<any, any>,
  selected_client_types: Array<ClientType>,
}

export const PatchClientTypeModalController: React.FC<PatchClientTypeModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [present, dismiss] = useIonModal(PatchEmployeeRoleModal, {
    selected_client_types: props.selected_client_types,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .patch_with_auth(auth!, `client_type?id=eq.${ev.detail.data.id}`, {
              name: ev.detail.data.name,
            })
            .then((_) => {
              props.refetch_client_types();
              presentAlert({
                header: "Данные типа клиента изменены",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_client_types();
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: process_error_hint(error.response!),
                buttons: ["Ок"]
              });
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" color="secondary" onClick={openModal}>
      <IonLabel>Изменить тип клиента</IonLabel>
    </IonButton>
  )
}