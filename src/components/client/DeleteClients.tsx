import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import { RefetchFunction } from 'axios-hooks'
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import Client from '../../interface/client';

export function DeleteClientsModal(
  {selected_clients, onDismiss}: {
    selected_clients: Array<Client>
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
          <IonTitle>Удаление клиентов</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_clients, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить клиентов? (${selected_clients.length})`}</IonText>
        <IonList>
          {selected_clients.map((employee) => {
            return <IonItem key={employee.id}>{`- ${employee.person!.surname} ${employee.person!.name} ${employee.person!.last_name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteClientsModalControllerProps {
  refetch_clients: RefetchFunction<any, any>,
  selected_clients: Array<Client>,
}

export const DeleteClientsModalController: React.FC<DeleteClientsModalControllerProps & AuthProps> = (props) => {
  const [present, dismiss] = useIonModal(DeleteClientsModal, {
    selected_clients: props.selected_clients,
    onDismiss: (data: Array<Client> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          Promise.allSettled(ev.detail.data.map(async (employee: Client) => {
            await API
              .delete_with_auth(props.auth, `client?id=eq.${employee.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                props.refetch_clients();
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response?.data),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            props.refetch_clients();
            presentAlert({
              header: "Клиенты удалены",
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