
import {
  AccordionGroupCustomEvent,
  IonAccordion,
  IonAccordionGroup,
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

import { useLocation } from 'react-router-dom';
import { personOutline, homeOutline, earthOutline, settingsOutline } from 'ionicons/icons';
import './Menu.css';
import { useRef } from 'react';
import { useHistory } from 'react-router'

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  children?: AppPage[]
}

const appPages: AppPage[] = [
  {
    title: 'Отели',
    url: '/page/Hotels',
    iosIcon: homeOutline,
    mdIcon: homeOutline
  },
  {
    title: 'Контактные лица',
    url: '/page/Workers',
    iosIcon: personOutline,
    mdIcon: personOutline,
    children: [
      {
        title: 'Контактные лица',
        url: '/page/Workers',
        iosIcon: personOutline,
        mdIcon: personOutline,
      },
      {
        title: 'Роли',
        url: '/page/WorkerRole',
        iosIcon: settingsOutline,
        mdIcon: settingsOutline,
      },
    ]
  },
  {
    title: 'Регионы',
    url: '/page/Regions',
    iosIcon: earthOutline,
    mdIcon: earthOutline
  },
];

const Menu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const accordionGroup = useRef<HTMLIonAccordionGroupElement>(null);

  const toggleAccordion = () => {
    if (!accordionGroup.current) {
      return;
    }
    accordionGroup.current.value = undefined;
  };

  const accordionGroupChange = (ev: AccordionGroupCustomEvent) => {
    history.push(ev.detail.value);
    console.log(history);
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Туристическая компания</IonListHeader>
          <IonNote>turbis@turbis.com</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                {
                  appPage.children === undefined ? 
                    <IonItem className={location.pathname === appPage.url ? 'selected' : ''} onClick={toggleAccordion} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem> :
                    <IonAccordionGroup ref={accordionGroup} color='white' onIonChange={accordionGroupChange}>
                      <IonAccordion value={appPage.url}>
                        <IonItem slot="header">
                          <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                          <IonLabel>{appPage.title}</IonLabel>
                        </IonItem>
                        {
                          appPage.children.map(c => {
                            return (
                              <IonItem slot="content" className={location.pathname === c.url ? 'selected' : ''} routerLink={c.url} routerDirection="none" lines="none" detail={false}>
                                <IonIcon slot="start" />
                                <IonIcon slot="start" ios={c.iosIcon} md={c.mdIcon} />
                                <IonLabel>{c.title}</IonLabel>
                              </IonItem>
                            )
                          })
                        }
                      </IonAccordion>
                    </IonAccordionGroup>
                }
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
