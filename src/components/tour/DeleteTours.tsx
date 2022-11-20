import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import { WorkerJoinedFetch } from '../../interface/worker';
import React from 'react';
import axios, { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import { RefetchFunction } from 'axios-hooks'

export function DeleteWorkersModal(
  {selected_workers, onDismiss}: {
    selected_workers: Array<WorkerJoinedFetch>
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
          <IonTitle>Удаление Сотрудников</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_workers, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить сотрудников? (${selected_workers.length})`}</IonText>
        <IonList>
          {selected_workers.map((worker) => {
            return <IonItem key={worker.id}>{`- ${worker.surname} ${worker.name} ${worker.last_name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface DeleteWorkersModalControllerProps {
  refetch_workers: RefetchFunction<any, any>,
  selected_workers: Array<WorkerJoinedFetch>,
}

export const DeleteToursModalController: React.FC<DeleteWorkersModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(DeleteWorkersModal, {
    selected_workers: props.selected_workers,
    onDismiss: (data: Array<WorkerJoinedFetch> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          Promise.allSettled(ev.detail.data.map(async (worker: WorkerJoinedFetch) => {
            await axios
              .delete(`https://api.necrom.ru/worker/${worker.id}`, {data: {
                db_user_email: "primitive_email@not.even.valid",
                db_user_password: "primitive_password",
              }})
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                props.refetch_workers();
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response?.data),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            props.refetch_workers();
            presentAlert({
              header: "Туры удалены",
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