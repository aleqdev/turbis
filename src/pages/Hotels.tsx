import { IonButtons, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { PatchHotelModalController } from '../components/hotel/PatchHotel';
import { DeleteHotelsModalController } from '../components/hotel/DeleteHotel';
import { HotelsList } from '../components/hotel/HotelsList';
import { PutHotelModalController } from '../components/hotel/PutHotel';
import Hotel from '../interface/hotel';
import { useAppDispatch, useAppSelector } from '../redux/store';
import NoAuth from '../components/composite/no_auth';
import { fetch } from '../redux/hotels';

const MetaPage: React.FC = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (!auth) {
    return <NoAuth/>
  }

  dispatch(fetch(auth));

  return <Page/>
}

const Page: React.FC = () => {
  const hotels = useAppSelector(state => state.hotels);

  const [selectedHotels, setSelectedHotels] = useState(Array<Hotel>);
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(false);

  useEffect(
    () => {
      if (hotels.status !== "ok") {
        return
      }

      setSelectedHotels(s => s.map((selected_hotel) => {
        return hotels.data.find((h) => h.id === selected_hotel.id)
      }).filter((h) => h !== undefined).map((h) => h!));
    },
    [hotels]
  );

  useEffect(
    () => {
      setClearSelectionTrigger(s => !s);
    },
    [hotels]
  )
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonItem lines='none'>
            <IonTitle>Отели</IonTitle>
            <IonList>
              {
                (selectedHotels?.length === 1) ? 
                  <PatchHotelModalController selected_hotels={selectedHotels}/>
                  : ""
              }
              {
                (selectedHotels?.length > 0) ? 
                  <DeleteHotelsModalController selected_hotels={selectedHotels}/>
                  : ""
              }
              <PutHotelModalController/>
            </IonList>
          </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <HotelsList clear_selection_trigger={clearSelectionTrigger} on_selected_change={setSelectedHotels} />
      </IonContent>
    </IonPage>
  );
};

export default MetaPage;
