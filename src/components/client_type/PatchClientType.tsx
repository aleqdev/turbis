import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { process_error_hint } from '../../utils/process_erros_hints';
import API from '../../utils/server';
import ClientType from '../../interface/client_type';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { clientTypesR } from '../../redux/store';

export function PatchEmployeeRoleModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const clientTypes = useAppSelector(state => state.clientTypes);

  const client_type = clientTypes.status === "ok" ? clientTypes.selected[0] : null;

  const inputName = useRef<HTMLIonInputElement>(null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  function confirm() {
    const name = inputName.current?.value;

    if (name) {
      onDismiss({
        id: client_type!.id,
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
          <IonInput ref={inputName} type="text" placeholder="Введите название" value={client_type!.name} required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export const PatchClientTypeModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const [present, dismiss] = useIonModal(PatchEmployeeRoleModal, {
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }
          
          API
            .patch_with_auth(auth!, `client_type?id=eq.${ev.detail.data.id}`, {
              name: ev.detail.data.name,
            })
            .then((_) => {
              presentAlert({
                header: "Данные типа клиента изменены",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: process_error_hint(error.response!),
                buttons: ["Ок"]
              });
            })
            .finally(() => {
              dispatch(clientTypesR.fetch(auth));
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