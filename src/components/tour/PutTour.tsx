import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTextarea, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import "react-datepicker/dist/react-datepicker.css";
import { AuthProps } from '../../interface/props/auth';
import Hotel from '../../interface/hotel';
import TourFeedingType from '../../interface/tour_feeding_type';
import API from '../../utils/server';
import { SelectWithSearchModal } from '../SelectWithSearch';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { formatDateDiff } from '../../utils/fmt';
import dayjs from 'dayjs';
import { process_error_hint } from '../../utils/process_erros_hints';
import presentNoAuthAlert from '../../utils/present_no_auth_alert';
import { toursR, tourFeedingTypesR, hotelsR } from '../../redux/store';

export function PutTourModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [hotels, tourFeedingTypes] = useAppSelector(state => [state.hotels, state.tourFeedingTypes]);
  const dispatch = useAppDispatch();

  const inputArrivalDate = useRef<HTMLIonInputElement>(null);
  const inputDepartureDate = useRef<HTMLIonInputElement>(null);
  const inputCost = useRef<HTMLIonInputElement>(null);
  const inputDescription = useRef<HTMLIonTextareaElement>(null);

  const [inputHotel, setInputHotel] = React.useState(null as Hotel | null);
  const [inputFeedingType, setInputFeedingType] = React.useState(null as TourFeedingType | null);
  const [diff, setDiff] = React.useState(null as string | null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);
  const [fromDate, setFromDate] = useState(0);
  const [endDate, setEndDate] = useState(0);
  const diffInputDate = useRef<HTMLIonInputElement>(null);

  const [presentHotelChoice, dismissHotelChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const hotels = useAppSelector(state => state.hotels)
      return hotels.status === "ok" ? hotels.data : null
    },
    title: "Выберите отель",
    formatter: (e: Hotel) => `${e.name} ( ${e.city!.name} )`,
    sorter: (e: Hotel, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.name.toLowerCase().includes(element) + 10 * +(e.name.toLowerCase() === element) + 
          +e.city!.name.toLowerCase().includes(element) + 10 * +(e.city!.name.toLowerCase() === element)
      }, 0);
    },
    keyer: (e: Hotel) => e.id,
    onDismiss: (data: object | null, role: string) => dismissHotelChoice(data, role),
  });

  const [presentFeedingTypeChoice, dismissFeedingTypeChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const tourFeedingTypes = useAppSelector(state => state.tourFeedingTypes)
      return tourFeedingTypes.status === "ok" ? tourFeedingTypes.data : null
    },
    title: "Выберите тип питания",
    formatter: (e: TourFeedingType) => `${e.name}`,
    sorter: (e: TourFeedingType, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.name.toLowerCase().includes(element)
      }, 0);
    },
    keyer: (e: TourFeedingType) => e.id,
    onDismiss: (data: object | null, role: string) => dismissFeedingTypeChoice(data, role),
  });

  function openHotelSelectModal() {
    presentHotelChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputHotel(ev.detail.data.value);
        }
      },
    });
  }

  function openFeedingTypeSelectModal() {
    presentFeedingTypeChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputFeedingType(ev.detail.data.value);
        }
      },
    });
  }

  function confirm() {
    const arrivalDate = inputArrivalDate.current?.value;
    const departureDate = inputDepartureDate.current?.value;
    const cost = inputCost.current?.value;
    const description = inputDescription.current?.value;

    if (inputHotel && inputFeedingType && arrivalDate && departureDate && cost && description) {
      onDismiss({
        arrivalDate: dayjs(arrivalDate, "DD-MM-YYYY"),
        departureDate: dayjs(departureDate, "DD-MM-YYYY"),
        description,
        cost,
        feedingType: inputFeedingType,
        hotel: inputHotel
      }, 'confirm');
    } else {
      setErrorMessage("Не все поля заполнены!")
    }
  }

  function calcDiff() {
    if (inputDepartureDate?.current?.value && inputArrivalDate?.current?.value) {
      const inputArrival = dayjs(inputArrivalDate.current.value as string, "DD-MM-YYYY").toDate();
      const inputDeparture = dayjs(inputDepartureDate.current.value as string, "DD-MM-YYYY").toDate();
      if (inputDeparture.getTime() - inputArrival.getTime() > 0) {
        setDiff(formatDateDiff(inputArrival, inputDeparture));
      }
    }
  }

  function diffDate() {
    let timestamp1 = fromDate
    let timestamp2 = endDate
    var difference = (timestamp2 - timestamp1) * 1000;
    console.log(timestamp1, timestamp2)
    var daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
    console.log('change', daysDifference)
    diffInputDate.current!.value = daysDifference
    console.log('change', diffInputDate.current!.value) 
  }

  useEffect(() => {
    dispatch(hotelsR.fetch(auth));
    dispatch(tourFeedingTypesR.fetch(auth));
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
          <IonTitle>Создать тур</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Создать
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked" >Отель</IonLabel>
          <IonButton disabled={hotels === null} onClick={() => openHotelSelectModal()}>
            {hotels === null ? "Загрузка..." : (inputHotel === null ? "Выбрать" : `${inputHotel.name}`)}
          </IonButton>
          <IonLabel position="stacked">{"Дата заезда (дд-мм-гггг)"}</IonLabel>
          <IonInput ref={inputArrivalDate} clearInput={true} type="text" placeholder="Введите дату" onIonChange={calcDiff} required/>
          <IonLabel position="stacked">{"Дата выезда (дд-мм-гггг)"}</IonLabel>
          <IonInput ref={inputDepartureDate} clearInput={true} type="text" placeholder="Введите дату" onIonChange={calcDiff} required/>
          <IonLabel position="stacked">{`Количество дней/ночей: ${diff ?? "..."}`}</IonLabel>
          <IonLabel position="stacked" >Вид питания</IonLabel>
          <IonButton disabled={tourFeedingTypes === null} onClick={() => openFeedingTypeSelectModal()}>
            {tourFeedingTypes === null ? "Загрузка..." : (inputFeedingType === null ? "Выбрать" : `${inputFeedingType.name}`)}
          </IonButton>
          <IonLabel position="stacked">{"Стоимость тура (руб.)"}</IonLabel>
          <IonInput ref={inputCost} clearInput={true} type="text" placeholder="Введите стоимость" required/>
          <IonLabel position="stacked">Описание</IonLabel>
          <IonTextarea ref={inputDescription} auto-grow={true} placeholder="Введите описание" required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export const PutTourModalController: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const [present, dismiss] = useIonModal(PutTourModal, {
    auth: auth!,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (auth === null) {
          return presentNoAuthAlert(presentAlert);
        }
        
        if (ev.detail.role === 'confirm') {
          API
            .post_with_auth(auth!, `tour`, {
              hotel_id: ev.detail.data.hotel.id,
              feeding_type_id: ev.detail.data.feedingType.id,
              arrival_date: ev.detail.data.arrivalDate,
              departure_date: ev.detail.data.departureDate,
              cost: ev.detail.data.cost,
              description: ev.detail.data.description,
            })
            .then((_) => {
              presentAlert({
                header: "Тур добавлен",
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
              dispatch(toursR.fetch(auth));
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Добавить тур</IonLabel>
    </IonButton>
  )
}
