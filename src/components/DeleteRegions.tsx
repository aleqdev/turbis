import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React, { Dispatch } from 'react';
import axios, { AxiosError } from 'axios';
import { process_error_hint } from '../utils/process_erros_hints';
import { RegionJoinedFetch } from '../interface/region';

export function DeleteRegionsModal(
  {selected_regions, onDismiss}: {
    selected_regions: Array<RegionJoinedFetch>
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
          <IonTitle>Удаление Регионов</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selected_regions, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        {/* Модалка */}
        {/* <IonText color="danger">{`Точно удалить регионы? (${selected_regions.length})`}</IonText>
        <IonList>
          {selected_regions.map((region) => {
            return <IonItem key={region.id}>{`- ${region.name} ${region.country_name}`}</IonItem>
          })}
        </IonList> */}
      </IonContent>
    </>
  )
}

export interface RemoveRegionsModalControllerProps {
  selected_regions: Array<RegionJoinedFetch>,
  set_selected_regions: Dispatch<React.SetStateAction<Array<RegionJoinedFetch>>>
}

export const DeleteRegionsModalController: React.FC<RemoveRegionsModalControllerProps> = (props) => {
  const [present, dismiss] = useIonModal(DeleteRegionsModal, {
    selected_workers: props.selected_regions,
    onDismiss: (data: Array<RegionJoinedFetch> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          props.set_selected_regions([]);
          Promise.allSettled(ev.detail.data.map(async (region: RegionJoinedFetch) => {
            await axios
              .delete(`https://api.necrom.ru/region/${region.id}`, {data: {
                db_user_email: "primitive_email@not.even.valid",
                db_user_password: "primitive_password",
              }})
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status == "rejected" && result.reason instanceof AxiosError) {
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response?.data),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            presentAlert({
              header: "Регионы удалены",
              buttons: ["Ок"]
            });
            window.location.reload()
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