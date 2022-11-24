import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTextarea, IonTitle, IonToolbar, useIonAlert, useIonModal } from '@ionic/react';
import React, { useRef, useState } from 'react'
import { OverlayEventDetail } from '@ionic/core/components';
import { RefetchFunction } from 'axios-hooks'
import { SelectWithSearchModal } from '../SelectWithSearch';
import { formatCity, formatPerson } from '../../utils/fmt';
import { process_error_hint } from '../../utils/process_erros_hints';
import { AuthProps } from '../../interface/props/auth';
import API from '../../utils/server';
import Person from '../../interface/person';
import City from '../../interface/city';
import { useAppSelector } from '../../redux/store';

export function PutHotelModal(
  {auth, onDismiss}: AuthProps & {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const [persons, setPersons] = React.useState(null as Array<Person> | null);
  const [cities, setCities] = React.useState(null as Array<City> | null);

  const inputName = useRef<HTMLIonInputElement>(null);
  const inputDescription = useRef<HTMLIonTextareaElement>(null);
  const [cityInput, setCityInput] = useState(null as City | null);
  const [ownerInput, setOwnerInput] = useState(null as Person | null);

  const [errorMessage, setErrorMessage] = useState(null as string | null);

  const [presentCityChoice, dismissCityChoice] = useIonModal(SelectWithSearchModal, {
    elements: cities,
    title: "Выберите город",
    formatter: (e: City) => formatCity(e),
    sorter: (e: City, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.name.toLowerCase().includes(element) + 10 * +(e.name.toLowerCase() === element) + 
          +e.region!.name.toLowerCase().includes(element) + 10 * +(e.region!.name.toLowerCase() === element) +
          +e.region!.country!.name.toLowerCase().includes(element) + 10 * +(e.region!.country!.name.toLowerCase() === element);
      }, 0);
    },
    keyer: (e: City) => e.id,
    onDismiss: (data: object | null, role: string) => dismissCityChoice(data, role),
  });

  const [presentOwnerChoice, dismissOwnerChoice] = useIonModal(SelectWithSearchModal, {
    elements: persons,
    title: "Выберите контактное лицо",
    formatter: (e: Person) => formatPerson(e),
    sorter: (e: Person, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value + 
          +e.name.toLowerCase().includes(element) +
          +e.surname.toLowerCase().includes(element) +
          +e.last_name.toLowerCase().includes(element) +
          +e.phone_number.includes(element);
      }, 0);
    },
    keyer: (e: Person) => e.id,
    onDismiss: (data: object | null, role: string) => dismissOwnerChoice(data, role),
  });

  function openCitySelectModal() {
    presentCityChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setCityInput(ev.detail.data.value);
        }
      },
    });
  }

  function openOwnerSelectModal() {
    presentOwnerChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setOwnerInput(ev.detail.data.value);
        }
      },
    });
  }

  React.useEffect(() => {
    API
      .get_with_auth(auth, 'person')
      .then((response: any) => {
        setPersons(response.data);
      });
  }, []);

  React.useEffect(() => {
    API
      .get_with_auth(auth, 'city?select=*,region(*,country(*))')
      .then((response: any) => {
        setCities(response.data);
      });
  }, []);

  function confirm() {
    const name = inputName.current?.value;
    const description = inputDescription.current?.value

    if (name && description && cityInput && ownerInput) {
      if (description.length > 500) {
        setErrorMessage("Описание отеля должно быть меньше 500 символов.")
      } else if (name.toString().length > 200) {
        setErrorMessage("Название отеля должно быть меньше 200 символов.")
      } else {
        onDismiss({
          name,
          description,
          city_id: cityInput.id,
          owner_id: ownerInput.id
        }, 'confirm');
      }
    } else {
      setErrorMessage("Не все поля заполнены!")
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
          <IonTitle>Добавить отель</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              Добавить
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
          <IonLabel position="stacked">Название</IonLabel>
          <IonInput ref={inputName} clearInput={true} type="text" placeholder="Введите имя" required/>
          <IonLabel position="stacked">Местоположение</IonLabel>
          <IonButton disabled={cities === null} onClick={() => openCitySelectModal()}>
            {cities === null ? "Загрузка..." : (cityInput === null ? "Выбрать" : formatCity(cityInput))}
          </IonButton>
          <IonLabel position="stacked" >Владелец</IonLabel>
          <IonButton disabled={persons === null} onClick={() => openOwnerSelectModal()}>
            {persons === null ? "Загрузка..." : (ownerInput === null ? "Выбрать" : formatPerson(ownerInput))}
          </IonButton>
          <IonLabel position="stacked">Описание</IonLabel>
          <IonTextarea ref={inputDescription} auto-grow={true} placeholder="Введите описание" required/>
        </IonItem>
      </IonContent>
    </>
  )
}

export type PutHotelModalControllerProps = {
  refetch_hotels: RefetchFunction<any, any>,
}

export const PutHotelModalController: React.FC<PutHotelModalControllerProps> = (props) => {
  const auth = useAppSelector(state => state.auth);
  
  const [present, dismiss] = useIonModal(PutHotelModal, {
    auth: auth!,
    onDismiss: (data: object | null, role: string) => dismiss(data, role),
  });
  const [presentAlert] = useIonAlert();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          API
            .post_with_auth(auth!, 'hotel', {
              name: ev.detail.data.name,
              description: ev.detail.data.description,
              city_id: ev.detail.data.city_id,
              owner_id: ev.detail.data.owner_id
            })
            .then((_) => {
              props.refetch_hotels();
              presentAlert({
                header: "Отель добавлен",
                buttons: ["Ок"]
              });
            })
            .catch((error) => {
              props.refetch_hotels();
              presentAlert({
                header: "Ошибка",
                subHeader: error.response.statusText,
                message: process_error_hint(error.response.data),
                buttons: ["Ок"]
              });
            });
        }
      },
    });
  }

  return (
    <IonButton routerDirection="none" onClick={openModal}>
      <IonLabel>Добавить отель</IonLabel>
    </IonButton>
  )
}
