import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import { RefetchFunction } from 'axios-hooks'
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import ClientType from '../../interface/client_type';
import { useAppSelector } from '../../redux/store';

export function DeleteClientTypesModal(
  {selected_client_types, onDismiss}: {
    selected_client_types: Array<ClientType>
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Удаление типов клиентов</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_client_types, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить типы клиентов? (${selected_client_types.length})`}</IonText>
        <IonList>
          {selected_client_types.map((role) => {
            return <IonItem key={role.id}>{`- ${role.name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteClientTypesModalControllerProps {
  refetch_client_types: RefetchFunction<any, any>,
  selected_client_types: Array<ClientType>,
}

export const DeleteClientTypesModalController: React.FC<DeleteClientTypesModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [present, dismiss] = useIonModal(DeleteClientTypesModal, {
    selected_client_types: props.selected_client_types,
    onDismiss: (data: Array<ClientType> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          Promise.allSettled(ev.detail.data.map(async (role: ClientType) => {
            await API
              .delete_with_auth(auth!, `client_type?id=eq.${role.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                props.refetch_client_types();
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response!),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            props.refetch_client_types();
            presentAlert({
              header: "Типы клиентов удалены",
              buttons: ["Ок"]
            });
          })
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" color="danger" onClick={openModal}>
      <IonLabel>Удалить</IonLabel>
    </IonButton>
  )
}