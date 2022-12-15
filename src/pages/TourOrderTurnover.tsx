import { IonButtons, IonCheckbox, IonCol, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';

import './Page.css';
import {
  IonContent,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { TourOrderTurnoverR, useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { TourOrderTurnoverTable } from '../components/tour_order_turnover/TourOrderTurnoverTable';
import { DatabaseAuth } from '../interface/database_auth';
import dayjs from 'dayjs';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);

  if (!auth) {
    return <NoAuth/>
  }

  return <Page/>
}

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const [auth, turnover] = useAppSelector(state => [state.auth, state.tourOrderTurnover]);
  const [dateBegin, setDateBegin] = React.useState(dayjs().subtract(1, 'year').toDate());
  const [dateEnd, setDateEnd] = React.useState(dayjs().toDate());
  const [dateBeginUnbounded, setDateBeginUnbounded] = React.useState(true);
  const [dateEndUnbounded, setDateEndUnbounded] = React.useState(true);

  useEffect(() => {
    dispatch(TourOrderTurnoverR.fetch(
      auth as DatabaseAuth, 
      dateBeginUnbounded ? new Date(0) : dateBegin, 
      dateEndUnbounded ? new Date(8640000000000000) : dateEnd
    ));
  }, [dateBegin, dateEnd, dateBeginUnbounded, dateEndUnbounded]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Отчёт компании</IonTitle>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonItem lines='none'>
          { 
            (turnover.status === "ok") ?
              <IonText>
                <h2>
                  Количество полученных денежных средств на счету компании: <span style={{color: 'red'}}>{turnover.data.total_money_received}</span> рублей
                </h2>
              </IonText>
              : <IonTitle>Загрузка...</IonTitle>
          }
        </IonItem>
        
        <IonItem lines='none'>
          <IonText><h2>Период отчета:</h2></IonText>
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem lines='none'>
                <IonLabel>Начальная дата выборки:</IonLabel>
              </IonItem>
              <IonItem lines='none'>
                <IonItem lines='none' slot='start'>
                  <IonCheckbox slot="start" checked={dateBeginUnbounded} onIonChange={(ev) => setDateBeginUnbounded(ev.detail.checked)}/>
                  <IonLabel>За всё время</IonLabel>
                </IonItem>
                <IonDatetimeButton datetime="datetime" disabled={dateBeginUnbounded}/>
                <IonModal keepContentsMounted={true}>
                  <IonDatetime onIonChange={(ev) => setDateBegin(dayjs(ev.detail.value as string).toDate())} presentation='date' id="datetime"></IonDatetime>
                </IonModal>
              </IonItem>
            </IonCol>

            <IonCol>  
              <IonItem lines='none'>
                <IonLabel>Конечная дата выборки:</IonLabel>
              </IonItem>
              <IonItem lines='none'>
                <IonItem lines='none' slot='start'>
                  <IonCheckbox slot="start" checked={dateEndUnbounded} onIonChange={(ev) => setDateEndUnbounded(ev.detail.checked)}/>
                  <IonLabel>За всё время</IonLabel>
                </IonItem>
                <IonDatetimeButton datetime="datetime2" disabled={dateEndUnbounded}/>
                <IonModal keepContentsMounted={true}>
                  <IonDatetime onIonChange={(ev) => setDateEnd(dayjs(ev.detail.value as string).toDate())} presentation='date' id="datetime2"></IonDatetime>
                </IonModal>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      
        <TourOrderTurnoverTable/>
        <IonItem lines='none'>
          <span style={{color: 'gray'}}>Нажмите `Ctrl`+`R` для обновления данных</span>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
