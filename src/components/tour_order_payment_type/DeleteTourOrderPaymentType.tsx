import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import API from '../../utils/server';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { tourOrderPaymentTypesR } from '../../redux/store';
import TourOrderPaymentType from '../../interface/tour_order_payment_type';

export function DeleteTourOrderPaymentTypeModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const tourOrderPaymentTypes = useAppSelector(state => state.tourOrderPaymentTypes);
  const selectedTourOrderPaymentTypes = tourOrderPaymentTypes.status === "ok" ? tourOrderPaymentTypes.selected : [];

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Удаление типов оплаты заказов туров</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selectedTourOrderPaymentTypes, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить типы оплаты заказов? (${selectedTourOrderPaymentTypes.length})`}</IonText>
        <IonList>
          {selectedTourOrderPaymentTypes.map((t) => {
            return <IonItem key={t.id}>{`- ID: ${t.id}, ${t.name}`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export const DeleteTourOrderPaymentTypeModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [present, dismiss] = useIonModal(DeleteTourOrderPaymentTypeModal, {
    onDismiss: (data: Array<TourOrderPaymentType> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }
          
          Promise.allSettled(ev.detail.data.map(async (tour_order_payment_type: TourOrderPaymentType) => {
            await API
              .delete_with_auth(auth!, `tour_order_payment_type?id=eq.${tour_order_payment_type.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                dispatch(tourOrderPaymentTypesR.fetch(auth));
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response!),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            dispatch(tourOrderPaymentTypesR.fetch(auth));
            presentAlert({
              header: "Типы оплатов заказов удалены",
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