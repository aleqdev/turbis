
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
import { cardOutline, cartOutline, personOutline, homeOutline, earthOutline, settingsOutline, callOutline, airplaneOutline, accessibilityOutline } from 'ionicons/icons';
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
    title: 'Оплаты туров',
    url: '/page/PayTours',
    iosIcon: cartOutline,
    mdIcon: cartOutline
  },
  {
    title: 'Продажи туров',
    url: '/page/SellTours',
    iosIcon: cardOutline,
    mdIcon: cardOutline
  },
  {
    title: 'Заказы туров',
    url: '/page/TourOrders',
    iosIcon: cartOutline,
    mdIcon: cartOutline,
    children: [
      {
        title: 'Заказы туров',
        url: '/page/TourOrders',
        iosIcon: cartOutline,
        mdIcon: cartOutline,
      },
      {
        title: 'Типы оплаты',
        url: '/page/TourOrderPaymentTypes',
        iosIcon: settingsOutline,
        mdIcon: settingsOutline,
      },
    ]
  },
  {
    title: 'Туры',
    url: '/page/Tours',
    iosIcon: airplaneOutline,
    mdIcon: airplaneOutline
  },
  {
    title: 'Контактные лица',
    url: '/page/Persons',
    iosIcon: callOutline,
    mdIcon: callOutline
  },
  {
    title: 'Сотрудники',
    url: '/page/Employees',
    iosIcon: personOutline,
    mdIcon: personOutline,
    children: [
      {
        title: 'Сотрудники',
        url: '/page/Employees',
        iosIcon: personOutline,
        mdIcon: personOutline,
      },
      {
        title: 'Роли',
        url: '/page/EmployeeRoles',
        iosIcon: settingsOutline,
        mdIcon: settingsOutline,
      },
    ]
  },
  {
    title: 'Клиенты',
    url: '/page/Clients',
    iosIcon: accessibilityOutline,
    mdIcon: accessibilityOutline,
    children: [
      {
        title: 'Клиенты',
        url: '/page/Clients',
        iosIcon: accessibilityOutline,
        mdIcon: accessibilityOutline,
      },
      {
        title: 'Типы Клиентов',
        url: '/page/ClientTypes',
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
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonAccordionGroup ref={accordionGroup} color='white' onIonChange={accordionGroupChange}>
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
                  }
                </IonMenuToggle>
              );
            })}
          </IonAccordionGroup>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
