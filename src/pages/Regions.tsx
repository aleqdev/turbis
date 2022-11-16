import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import './Page.css';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonMenuToggle,
} from '@ionic/react';


interface AppPage {
  url: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Add region',
    url: '/page/add_region',
  },
];

interface Region {
  title: string;
}

const Regions: Region[] = [
  {
    title: 'Moskow',
  },
  {
    title: 'Novosibirsk',
  },
  {
    title: 'St. Petersburg',
  },
  {
    title: 'Kaliningrad',
  },
];

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Regions</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={window.location.pathname === appPage.url ? 'selected' : 'functions'} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        {/* <ExploreContainer name={name} /> */}
        <br></br><br></br><br></br>
          <h4>List Regions:</h4>

        <IonList id="hotels_list">
          {Regions.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={true === true ? 'selected' : 'item'} routerDirection="none" lines='full' detail={false}>
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Page;
