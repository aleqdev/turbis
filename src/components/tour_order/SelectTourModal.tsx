import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonText, IonTitle, IonToolbar, useIonModal } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { SelectWithSearchModal } from "../SelectWithSearch";
import Tour from "../../interface/tour";
import { useAppSelector } from "../../redux/store";
import { formatTour } from "../../utils/fmt";

export function SelectTourModal(
  {
    onDismiss
  }: {
    onDismiss: (data?: object | null, role?: string) => void
  }
) {
  const tours = useAppSelector(state => state.tours);
  const [errorMessage, setErrorMessage] = useState(null as string | null);
  const [inputPeopleCount, setInputPeopleCount] = useState(0 as number);
  const [inputTourPrice, setInputTourPrice] = useState(null as number | null);
  const [inputTour, setInputTour] = useState(null as Tour | null);
  const [totalCost, setTotalCost] = useState(null as number | null);

  function confirm() {
    if (inputPeopleCount <= 0) {
      return setErrorMessage("Кол-во людей должно быть натуральным числом");
    }

    if (inputTourPrice !== null && totalCost !== null && inputTour !== null) {
      onDismiss({
        value: {
          tour: inputTour,
          price: inputTourPrice,
          peopleCount: inputPeopleCount
        }
      }, 'confirm');
    } else {
      setErrorMessage("Элемент не выбран");
    }
  }

  const [presentTourChoice, dismissTourChoice] = useIonModal(SelectWithSearchModal, {
    acquirer: () => {
      const tour = useAppSelector(state => state.tours)
      return tour.status === "ok" ? tour.data : null
    },
    title: "Выберите тур",
    formatter: (e: Tour) => formatTour(e),
    sorter: (e: Tour, query: string) => {
      return query.split(' ').reduce((value, element) => {
        element = element.toLowerCase();
        return value +
          +e.hotel!.name!.toLowerCase().includes(element) + 
          +e.hotel!.city!.name!.toLowerCase().includes(element) +
          +e.cost!.toString().toLowerCase().includes(element);
      }, 0);
    },
    keyer: (e: Tour) => e.id,
    onDismiss: (data: object | null, role: string) => dismissTourChoice(data, role),
  });

  useEffect(() => {
    if (inputTour !== null) {
      setInputTourPrice(inputTour.cost);
    }
  }, [inputTour]);

  useEffect(() => {
    if (inputTourPrice !== null) {
      // console.log(Number(inputTourPrice), Number(inputPeopleCount))
      setTotalCost(Number((inputTourPrice * inputPeopleCount).toFixed(2)));
    }
  }, [inputTourPrice, inputPeopleCount]);

  function openTourSelectModal() {
    presentTourChoice({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setInputTour(ev.detail.data.value);
        }
      },
    });
  }

  // function onChangePriceTour(value:any) {
  // }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => {onDismiss(null, "cancel")}}>
              {"Отмена"}
            </IonButton>
          </IonButtons>
          <IonTitle>{"Добавление тура в заказ"}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={confirm}>
              {"Подвердить"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
            {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}
            <IonLabel position="stacked">Тур: </IonLabel>
              <IonButton disabled={tours === null} onClick={() => openTourSelectModal()}>
                {tours === null ? "Загрузка..." : (inputTour === null ? "Выбрать" : formatTour(inputTour))}
              </IonButton>
            <IonLabel position="stacked" >Цена (в рублях)</IonLabel><br/>
            <CurrencyInput suffix="" value={inputTourPrice} onValueChange={((value:any, name:any) =>{setInputTourPrice(value)})} decimalsLimit={2} decimalScale={2} decimalSeparator="." disableGroupSeparators={true} allowNegativeValue={false} step={1}></CurrencyInput>
            <IonLabel position="stacked" >Кол-во человек</IonLabel><br/>
            <CurrencyInput disableGroupSeparators={true} value={inputPeopleCount} allowDecimals={false} allowNegativeValue={false} step={1} onChange={(ev:any) =>{setInputPeopleCount(Number(ev.target.value))}}></CurrencyInput>
            {/* <IonInput value={inputPeopleCount} type={'number'} step={'1'} onIonChange={(ev:any) =>{setInputPeopleCount(Number(ev.target.value))}}></IonInput> */}
            <IonLabel position="stacked" >Общая стоимость</IonLabel><br/>
            <CurrencyInput suffix=" ₽" value={totalCost} decimalsLimit={2} disabled allowNegativeValue={false} step={1}></CurrencyInput>
        </IonItem>
      </IonContent>
    </>
  )
}

