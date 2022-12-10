import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import React from 'react';
import { AxiosError } from 'axios';
import { process_error_hint } from '../../utils/process_erros_hints';
import API from '../../utils/server';
import { tourOrderPurchasesR, useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import TourOrderPayment from '../../interface/tour_order_payment';
import TourOrderPurchase from '../../interface/tour_order_purchase';

export function DeleteTourOrderPurchaseModal(
  {onDismiss}: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const tourOrderPurchases = useAppSelector(state => state.tourOrderPurchases);
  const selectedTourOrderPurchases = tourOrderPurchases.status === "ok" ? tourOrderPurchases.selected : [];

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Удаление записей о заказах туров</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => {onDismiss(selectedTourOrderPurchases, "confirm")}}>
              Удалить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" >
        <IonText color="danger">{`Точно удалить записи о заказах туров? (${selectedTourOrderPurchases.length})`}</IonText>
        <IonList>
          {selectedTourOrderPurchases.map((t) => {
            return <IonItem key={t.id}>{`- ID: ${t.id}, ${t.tour!.hotel!.name} - бронь подтверждена: ${t.reservations_confirmed ? "Да" : "Нет" }`}</IonItem>
          })}
        </IonList>
      </IonContent>
    </>
  )
}

export const DeleteTourOrderPurchaseModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [present, dismiss] = useIonModal(DeleteTourOrderPurchaseModal, {
    onDismiss: (data: Array<TourOrderPayment> | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          if (auth === null) {
            return presentNoAuthAlert(presentAlert);
          }
          
          Promise.allSettled(ev.detail.data.map(async (tour_order_purchase: TourOrderPurchase) => {
            await API
              .delete_with_auth(auth!, `tour_order_purchase?id=eq.${tour_order_purchase.id}`)
          }))
          .then((results) => {
            for (const result of results) {
              if (result.status === "rejected" && result.reason instanceof AxiosError) {
                dispatch(tourOrderPurchasesR.fetch(auth));
                presentAlert({
                  header: "Ошибка",
                  subHeader: result.reason.response?.statusText,
                  message: process_error_hint(result.reason.response!),
                  buttons: ["Ок"]
                });
                return;
              }
            }
            dispatch(tourOrderPurchasesR.fetch(auth));
            presentAlert({
              header: "записи заказах туров удалены",
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