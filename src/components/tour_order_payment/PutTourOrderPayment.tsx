import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import { tourOrderPaymentsR, useAppDispatch, useAppSelector } from '../../redux/store';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { tourOrdersR } from '../../redux/store';
import { SelectWithSearchModal } from '../SelectWithSearch';
import TourOrder from '../../interface/tour_order';
import Person from '../../interface/person';

export function PutTourOrderPaymentModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const tourOrders = useAppSelector(state => state.tourOrders);
  const inputName = useRef<HTMLIonInputElement>(null);
  const [inputTourOrder, setInputTourOrder] = React.useState(null as TourOrder | null);
  const [errorMessage, setErrorMessage] = useState(null as string | null);
  const dispatch = useAppDispatch();

  function confirm() {
    const name = inputName.current?.value!;
    if (name) {
      onDismiss({
        name: name,
        money_received: inputTourOrder?.cost,
        tour_order_id: inputTourOrder?.id
      }, 'confirm');
    } else {
      setErrorMessage("Не все поля заполнены!")
    }
  }

  const [presentTourOrderChoice, dismissTourOrderChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const toursOrders = useAppSelector(state => state.tourOrders)
      return toursOrders.status === "ok" ? toursOrders.data : null
    },
    title: "Выберите заказ",
    formatter: (e: TourOrder) => `Заказ №${e.group_id} ${e.cost} руб. <${e!.payment_type!.name}> ${Person.format(e.client?.person!)}`,
    sorter: (e: TourOrder, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return +
          +e.tour!.hotel!.name.toLowerCase().includes(element) + 10 * +(e.tour!.hotel!.name.toLowerCase() === element) + 
          +e.tour!.hotel!.city!.name.toLowerCase().includes(element) + 10 * +(e.tour!.hotel!.city!.name.toLowerCase() === element)
      }, 0);
    },
    keyer: (e: TourOrder) => e.id,
    onDismiss: (data: object | null, role: string) => dismissTourOrderChoice(data, role),
  });

  function openTourOrderSelectModal() {
    presentTourOrderChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputTourOrder(ev.detail.data.value);
        }
      },
    });
  }

  useEffect(() => {
    dispatch(tourOrdersR.fetch(auth));
  }, []);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              Отмена
            </IonButton>
          </IonButtons>
          <IonTitle>Зарегистрировать оплату тура</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Зарегистрировать
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked" >Заказ тура</IonLabel>
          <IonButton disabled={tourOrders === null} onClick={() => openTourOrderSelectModal()}>
            {tourOrders === null ? "Загрузка..." : (inputTourOrder === null ? "Выбрать" : `Заказ №${inputTourOrder.group_id} <${inputTourOrder.payment_type?.name}> ${Person.format(inputTourOrder.client?.person!)}`)}
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Сумма оплаты</IonLabel>
          <IonInput ref={inputName} value={inputTourOrder?.cost} disabled={true} type="text" placeholder="= 0 р" required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export const PutTourOrderPaymentModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const [present, dismiss] = useIonModal(PutTourOrderPaymentModal, {
    auth,
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
            .post_with_auth(auth!, `tour_order_payment`, {
              tour_order_id: ev.detail.data.tour_order_id,
              money_received: ev.detail.data.money_received
            })
            .then((_) => {
              presentAlert({
                header: "Данные об оплате тура добавлены",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: process_error_hint(error.response),
                buttons: ["Ок"]
              });
            })
            .finally(() => {
              dispatch(tourOrderPaymentsR.fetch(auth))
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Зарегистрировать оплату заказа тура</IonLabel>
    </IonButton>
  )
}