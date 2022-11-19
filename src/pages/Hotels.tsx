import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { HotelJoinedFetch } from '../interface/hotel';
import { PutWorkerModalController } from '../components/worker/PutWorker';
import { PatchHotelModalController } from '../components/hotel/PatchHotel';
import useAxios from 'axios-hooks'
import { DeleteHotelsModalController } from '../components/hotel/DeleteHotel';
import { HotelsList } from '../components/hotel/HotelsList';

const Page: React.FC = () => {
  const [selected_hotels, set_selected_hotels] = useState(Array<HotelJoinedFetch>);

  const [{ data: hotels }, refetch_hotels]: [{data?: Array<HotelJoinedFetch>}, ...any] = useAxios(
    'https://api.necrom.ru/hotel?join=true'
  );

  useEffect(
    () => {
      set_selected_hotels(selected_hotels.map((selected_hotel) => {
        return hotels?.find((h) => h.id == selected_hotel.id)
      }).filter((h) => h != undefined).map((h) => h!));
    },
    [hotels]
  );
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Отели</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList id="inbox-list">
          <PutWorkerModalController refetch_workers={refetch_hotels} />
        </IonList>

        {
          (selected_hotels?.length > 0 ) ? 
            <DeleteHotelsModalController refetch_hotels={refetch_hotels} selected_hotels={selected_hotels}/>
            : ""
        }

        {
          (selected_hotels?.length > 0 ) ? 
            <PatchHotelModalController refetch_hotels={refetch_hotels} selected_hotels={selected_hotels}/>
            : ""
        }
        
        <HotelsList hotels={hotels!} on_selected_change={set_selected_hotels} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
