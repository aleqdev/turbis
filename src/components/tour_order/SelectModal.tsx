import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonSearchbar, IonText, IonTitle, IonToolbar, useIonModal } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import City from "../../interface/city";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { formatCity, formatTour } from "../../utils/fmt";
import { SelectWithSearchModal } from "../SelectWithSearch";
import { hotelsR, personsR, citiesR } from '../../redux/store';
import auth from "../../redux/auth";
import { AuthProps } from "../../interface/props/auth";
import Tour from "../../interface/tour";

export interface SelectWithSearchModalParams<T> {
  acquirer: () => Array<T>,
  title: string,
  cancel_text: string | undefined,
  confirm_text: string | undefined,
  formatter: (e: T) => string,
  sorter: (e: T, query: string) => number,
  keyer: (e: T) => number,
  onDismiss: (data?: object | null, role?: string) => void
}

export function SelectModal<T>(
  {
    acquirer,
    title,
    cancel_text,
    confirm_text, 
    formatter,
    sorter,
    keyer,
    onDismiss
  }: SelectWithSearchModalParams<T>
) {
  const [errorMessage, setErrorMessage] = useState(null as string | null);
  const [value, setValue] = useState(null as T | null);
  const [priceTourInputOld, setPriceTourInputOld] = useState(null);
  const priceTourInput = useRef<any>(0);
  const totalCost = useRef<any>(0);
  const [cntPerson, setCntPerson] = useState(0);
  // const priceTourInput = useRef<HTMLIonInputElement>(null);
  const [persons, cities] = useAppSelector(state => [state.persons, state.cities]);
  const elements = acquirer();

  const [results, setResults] = useState(elements === null ? [] : [...elements.slice(0, 10)]);
  useEffect(() => {
    setResults(elements === null ? [] : [...elements.slice(0, 10)]);
  }, [elements]);

  function confirm() {
    if (priceTourInput.current.value !== 0 && cntPerson !== 0 && cityInput !== null) {
      const priceTourInput2:number = priceTourInput.current.value
      const totalCost2:number = totalCost.current.value
      onDismiss({
        cntPerson, cityInput, priceTourInput2,totalCost2
      }, 'confirm');
    } else {
      setErrorMessage("Элемент не выбран");
    }
  }

  const handleChange = (ev: Event) => {
    let query = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!;

    setResults(elements.sort((a, b) => sorter(b, query) - sorter(a, query)).slice(0, 10));
  }
  const [cityInput, setCityInput] = useState(null as Tour | null);
  const [presentCityChoice, dismissCityChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const tour = useAppSelector(state => state.tours)
      return tour.status === "ok" ? tour.data : null
    },
    title: "Выберите тур",
    formatter: (e: Tour) => formatTour(e),
    sorter: (e: Tour, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value
          // +e.hotel!.name!.toLowerCase().includes(element) + 
          // e.hotel!.city!.name!.toLowerCase().includes(element)  +
          // +e.cost!.toString().toLowerCase().includes(element);
      }, 0);
    },
    keyer: (e: City) => e.id,
    onDismiss: (data: object | null, role: string) => dismissCityChoice(data, role),
  });

  // Подстановка цены тура в инпут цены, после выборки тура
  useEffect(() => {
    priceTourInput!.current!.value = priceTourInputOld
    totalCost.current.value = (Number(cntPerson) * Number(priceTourInputOld)).toFixed(2)
  });

  useEffect(() => {
    totalCost.current.value = (Number(cntPerson) * Number(priceTourInput.current.value)).toFixed(2)
  }, [cntPerson]);

  useEffect(() => {
    totalCost.current.value = (Number(cntPerson) * Number(priceTourInput.current.value)).toFixed(2)
  }, [priceTourInputOld]);

  function openTourSelectModal() {
    presentCityChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setPriceTourInputOld(ev.detail.data.value.cost)
          setCityInput(ev.detail.data.value);
        }
      },
    });
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              {cancel_text ?? "Отмена"}
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              {confirm_text ?? "Подвердить"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
            {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
            <IonLabel position="stacked">Тур: </IonLabel>
              <IonButton disabled={cities === null} onClick={() => openTourSelectModal()}>
                {cities === null ? "Загрузка..." : (cityInput === null ? "Выбрать" : formatTour(cityInput))}
              </IonButton>
            <IonLabel position="stacked" >Цена  (в рублях)</IonLabel><br />
            <CurrencyInput suffix="" decimalScale={2} fixedDecimalLength={2} decimalSeparator={'.'} disableGroupSeparators={true} decimalsLimit={2} ref={priceTourInput} allowNegativeValue={false} step={1} onChange={(ev:any) => {setPriceTourInputOld(ev.target.value)}}></CurrencyInput>
            <IonLabel position="stacked" >Кол-во человек</IonLabel><br />
            <CurrencyInput disableGroupSeparators={true} allowDecimals={false} allowNegativeValue={false} step={1} onChange={(ev:any) =>{ setCntPerson(ev.target.value)}}></CurrencyInput>
            <IonLabel position="stacked" >Общая стоимость</IonLabel><br />
            <CurrencyInput suffix=" ₽" ref={totalCost} decimalsLimit={2} disabled allowNegativeValue={false} step={1}></CurrencyInput>
        </IonItem>
      </IonContent>
    </>
  )
}

