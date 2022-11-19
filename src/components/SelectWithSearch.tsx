import { IonButton, IonButtons, IonContent, IonHeader, IonList, IonSearchbar, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { useRef, useState } from "react";

export interface SelectWithSearchModalParams<T> {
  elements: Array<T>,
  title: string,
  cancel_text: string | undefined,
  confirm_text: string | undefined,
  formatter: (e: T) => string,
  sorter: (e: T, query: string) => number,
  keyer: (e: T) => number,
  onDismiss: (data?: object | null, role?: string) => void
}

export function SelectWithSearchModal<T>(
  {
    elements,
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
  const [results, setResults] = useState(elements === null ? [] : [...elements]);

  const inputQuery = useRef<HTMLIonSearchbarElement>(null);

  function confirm() {
    if (value !== null) {
      onDismiss({
        value
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
        {errorMessage ? <IonText color={'danger'}> {errorMessage}</IonText> : ""}

        <IonSearchbar ref={inputQuery} debounce={300} onIonChange={(ev) => handleChange(ev)}></IonSearchbar>

        <IonList>
          { results.slice(0, 10).map(result => {
            const label = formatter(result);
            return <IonButton key={keyer(result)} onClick={(_) => {
              setValue(result);
              inputQuery.current!.value = label;
            }}>{ label }</IonButton>
          })}
        </IonList>
      </IonContent>
    </>
  )
}
