import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import { WorkerJoinedFetch } from '../interface/worker';
import React, { Dispatch } from 'react';

export function RemoveWorkersModal(
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
            return <IonItem>{`- ${worker.surname} ${worker.name} ${worker.last_name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export interface RemoveWorkersModalControllerProps {
  selected_workers: Array<WorkerJoinedFetch>,
  set_selected_workers: Dispatch<React.SetStateAction<Array<WorkerJoinedFetch>>>
}

export const RemoveWorkersModalController: React.FC<RemoveWorkersModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(RemoveWorkersModal, {
    selected_workers: props.selected_workers,
    onDismiss: (data: Array<WorkerJoinedFetch> | null, role: string) => dismiss(data, role),
  });

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          props.set_selected_workers([]);
          window.location.reload();
          console.log(`Hello, ${ev.detail.data}!`);
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