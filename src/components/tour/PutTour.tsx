import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import axios from 'axios';
import React, { useMemo, useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { AuthProps } from '../../interface/props/auth';
import Tour from '../../interface/tour';
import Hotel from '../../interface/hotel';
import TourFeedingType from '../../interface/tour_feeding_type';
import API from '../../utils/server';
import { SelectWithSearchModal } from '../SelectWithSearch';

export function PutTourModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [hotels, setHotels] = React.useState(null as Array<Hotel> | null);
  const [feedingTypes, setFeedingTypes] = React.useState(null as Array<TourFeedingType> | null);

  const inputArrivalDate = useRef<HTMLIonInputElement>(null);
  const inputDepartureDate = useRef<HTMLIonInputElement>(null);
  const inputCost = useRef<HTMLIonInputElement>(null);
  const inputDescription = useRef<HTMLIonTextareaElement>(null);

  const [inputHotel, setInputHotel] = React.useState(null as Hotel | null);
  const [inputFeedingType, setInputFeedingType] = React.useState(null as TourFeedingType | null);
  const [diffDay, setDiffDay] = React.useState(null as number | null);
  const [diffNight, setDiffNight] = React.useState(null as number | null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  const [presentHotelChoice, dismissHotelChoice] = useIonModal(SelectWithSearchModal, {
    elements: hotels,
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
    elements: feedingTypes,
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

  React.useEffect(() => {
    API 
      .get_with_auth(auth, 'hotel?select=*,city(*),owner:person(*)')
      .then((response: any) => {
        setHotels(response.data);
      });
  }, []);

  React.useEffect(() => {
    API 
      .get_with_auth(auth, 'tour_feeding_type')
      .then((response: any) => {
        setFeedingTypes(response.data);
      });
  }, []);


  function confirm() {
    const arrivalDate = inputArrivalDate.current?.value;
    const departureDate = inputDepartureDate.current?.value;
    const cost = inputCost.current?.value;
    const description = inputDescription.current?.value;

    if (inputHotel && inputFeedingType && arrivalDate && departureDate && cost && description) {
      onDismiss({
        arrivalDate,
        departureDate,
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
      const diffInMs = Date.parse(inputDepartureDate.current.value as string) - Date.parse(inputArrivalDate.current.value as string)
      if (diffInMs < 0) {
        return
      }
      setDiffDay(diffInMs / (1000 * 60 * 60 * 24));
      setDiffNight(diffInMs / (1000 * 60 * 60 * 24));
    }
  }

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
          <IonLabel position="stacked">{"Дата заезда (месяц, день, год)"}</IonLabel>
          <IonInput ref={inputArrivalDate} clearInput={true} type="text" placeholder="Введите дату" onIonChange={calcDiff} required/>
          <IonLabel position="stacked">{"Дата выезда (месяц, день, год)"}</IonLabel>
          <IonInput ref={inputDepartureDate} clearInput={true} type="text" placeholder="Введите дату" onIonChange={calcDiff} required/>
          <IonLabel position="stacked">{`Количество дней: ${diffDay ?? "..."}, Количество ночей: ${diffNight ?? "..."}`}</IonLabel>
          <IonLabel position="stacked" >Вид питания</IonLabel>
          <IonButton disabled={feedingTypes === null} onClick={() => openFeedingTypeSelectModal()}>
            {feedingTypes === null ? "Загрузка..." : (inputFeedingType === null ? "Выбрать" : `${inputFeedingType.name}`)}
          </IonButton>
          <IonLabel position="stacked">Стоимость тура</IonLabel>
          <IonInput ref={inputCost} clearInput={true} type="text" placeholder="Введите стоимость" required/>
          <IonLabel position="stacked">Описание</IonLabel>
          <IonTextarea ref={inputDescription} auto-grow={true} placeholder="Введите описание" required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export interface PutTourModalControllerProps {
  refetch_tours: RefetchFunction<any, any>,
}

export const PutTourModalController: React.FC<PutTourModalControllerProps & AuthProps> = (props) => {
  const [present, dismiss] = useIonModal(PutTourModal, {
    auth: props.auth,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .post_with_auth(props.auth, `tour`, {
              hotel_id: ev.detail.data.hotel.id,
              feeding_type_id: ev.detail.data.feedingType.id,
              arrival_date: ev.detail.data.arrivalDate,
              departure_date: ev.detail.data.departureDate,
              cost: ev.detail.data.cost,
              description: ev.detail.data.description,
            })
            .then((_) => {
              props.refetch_tours();
              presentAlert({
                header: "Тур добавлен",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_tours();
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: error.response.data,
                buttons: ["Ок"]
              });
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" color="secondary" onClick={openModal}>
      <IonLabel>Добавить тур</IonLabel>
    </IonButton>
  )
}
