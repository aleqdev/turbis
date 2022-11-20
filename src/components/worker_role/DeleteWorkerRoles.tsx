import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import axios, { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import { RefetchFunction } from 'axios-hooks'
import { WorkerRole } from '../../interface/worker_role';

export function DeleteWorkerRolesModal(
  {selected_worker_roles, onDismiss}: {
    selected_worker_roles: Array<WorkerRole>
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
          <IonTitle>Удаление Ролей</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_worker_roles, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить роли? (${selected_worker_roles.length})`}</IonText>
        <IonList>
          {selected_worker_roles.map((role) => {
            return <IonItem key={role.id}>{`- ${role.name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteWorkerRolesModalControllerProps {
  refetch_worker_roles: RefetchFunction<any, any>,
  selected_worker_roles: Array<WorkerRole>,
}

export const DeleteWorkerRolesModalController: React.FC<DeleteWorkerRolesModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(DeleteWorkerRolesModal, {
    selected_worker_roles: props.selected_worker_roles,
    onDismiss: (data: Array<WorkerRole> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          Promise.allSettled(ev.detail.data.map(async (role: WorkerRole) => {
            await axios
              .delete(`https://api.necrom.ru/worker_role/${role.id}`, {data: {
                db_user_email: "primitive_email@not.even.valid",
                db_user_password: "primitive_password",
              }})
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                props.refetch_worker_roles();
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response?.data),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            props.refetch_worker_roles();
            presentAlert({
              header: "Роли удалены",
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