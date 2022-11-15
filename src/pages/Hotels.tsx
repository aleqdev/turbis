import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSplitPane, IonText } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

interface Hotel {
  title: string;
  place: string;
  phone: string;
  admin_fio: string;
  description: string;
}

const Hotels: Hotel[] = [
  {
    title: 'Hotel Graph',
    place:'Moskow',
    phone: '+7(495)775-09-45',
    admin_fio: 'Васильев Василий Васильевич', 
    description: 'Лучший отель в Москве, 5 звезд...'
  },
  {
    title: 'Hotel Graph',
    place:'Moskow',
    phone: '+7(495)775-09-45',
    admin_fio: 'Васильев Василий Васильевич', 
    description: 'Лучший отель в Москве, 5 звезд...'
  },
  {
    title: 'Hotel Graph',
    place:'Moskow',
    phone: '+7(495)775-09-45',
    admin_fio: 'Васильев Василий Васильевич', 
    description: 'Лучший отель в Москве, 5 звезд...'
  },
  {
    title: 'Hotel Graph',
    place:'Moskow',
    phone: '+7(495)775-09-45',
    admin_fio: 'Васильев Василий Васильевич', 
    description: 'Лучший отель в Москве, 5 звезд...'
  },
];

interface AppPage {
  url: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Add Hotel',
    url: '/page/add_hotel',
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
          <IonTitle>Hotels</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList id="inbox-list" >
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
        <br></br><br></br><br></br>
        {/* <ExploreContainer name={name} /> */}
          <h4>List Hotels:</h4>
        <IonList id="hotels_list">
          {Hotels.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={true === true ? 'selected' : 'functions'} routerDirection="none" lines="full" detail={false}>
                  <IonLabel>{appPage.title}</IonLabel>
                  <IonText><br></br>
                  Manager: {appPage.admin_fio}<br></br><br></br>
                  Place: {appPage.place}<br></br><br></br>
                  Phone: {appPage.phone}<br></br><br></br>
                  Description: {appPage.description}<br></br><br></br>
                  </IonText>
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
