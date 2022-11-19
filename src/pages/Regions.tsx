import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';
import {
  IonContent,
  IonList,
} from '@ionic/react';
import React from 'react';
import { WorkerJoinedFetch } from '../interface/worker';
import { DeleteRegionsModalController } from '../components/DeleteRegions';
import { RegionsList } from '../components/RegionsList';
import { RegionJoinedFetch } from '../interface/region';

const Page: React.FC = () => {
  const [selected_regions, set_selected_regions] = React.useState(Array<RegionJoinedFetch>);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Регионы</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList id="inbox-list">
          {/* <PutWorkerModalController /> */}
        </IonList>

        {/* {
          (selected_regions?.length > 0 ) ? 
            <DeleteRegionsModalController selected_regions={selected_regions} set_selected_regions={set_selected_regions}/>
            : ""
        }
        {
          (selected_regions?.length === 1 ) ? 
            <PatchRegionModalController selected_regions={selected_regions} set_selected_regions={set_selected_regions}/>
            : ""
        } */}
        
        <RegionsList on_selected_change={set_selected_regions}></RegionsList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
