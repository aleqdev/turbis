import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react';
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

interface AppPage {
  url: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Add Admin',
    url: '/page/add_admin',
  },
];

interface Admin {
  fio: string;
  role: string;
  phone: string;
  mail: string;
}

const Admins: Admin[] = [
  {
    fio: 'Васильев Василий Васильевич',
    role: 'Управляющий',
    phone: '+7(495)775-09-45',
    mail: 'some_mail@main.com'
  },
  {
    fio: 'Васильев Василий Васильевич',
    role: 'Управляющий',
    phone: '+7(495)775-09-45',
    mail: 'some_mail@main.com'
  },
  {
    fio: 'Васильев Василий Васильевич',
    role: 'Управляющий',
    phone: '+7(495)775-09-45',
    mail: 'some_mail@main.com'
  },
  {
    fio: 'Васильев Василий Васильевич',
    role: 'Управляющий',
    phone: '+7(495)775-09-45',
    mail: 'some_mail@main.com'
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
          <IonTitle>Admins</IonTitle>
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
          <h4>List Managers:</h4>

        <IonList id="admins-list">
          {Admins.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={ true === true ? 'selected' : 'functions'}  routerDirection="none" lines="full" detail={false}>
                  <IonLabel>{appPage.fio}</IonLabel>
                  <IonText><br></br>
                  ФИО Администратора: {appPage.fio}<br></br><br></br>
                  Role: {appPage.role}<br></br><br></br>
                  Phone: {appPage.phone}<br></br><br></br>
                  E-mail: {appPage.mail}<br></br><br></br>
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
