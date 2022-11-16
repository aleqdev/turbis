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
import React from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from "react-data-table-component";

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

// interface Admin {
//   id: number;
//   name: string;
//   surname: string;
//   lastname: string;
//   role_id: string;
//   phone: string;
//   email: string;
// }
// let result:Admin = []
// const API_RESULT = fetch(
//     "https://api.necrom.ru/worker"
//     ,{
//       method: "get",
//       headers: { Accept: 'application/json' }
//     })
//     .then((response) => {return response.json()}).then((resp) => {result = resp});

// console.log(ResultApi)
// let Admins = []
// result.forEach(element => {
//   Admins.push(element)
// });
// console.log(result)
// console.log(JSON.parse(result))

interface Worker {
  id: number,
  name: string,
  surname: string,
  last_name: string,
  phone_number: string,
  email: string,
  role_name: string
}

const Page: React.FC = () => {
  const [admins, setAdmins] = React.useState(null as Array<Worker> | null);

  const { name } = useParams<{ name: string; }>();

  React.useEffect(() =>  {
    axios
      .get("https://api.necrom.ru/worker?join=true")
      .then((response) => setAdmins(response.data));
  });

  console.log(admins);

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
          {
            (admins === null) ?
              <IonTitle>Загрузка...</IonTitle> :
              generateWorkersTable(admins)
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

function generateWorkersTable(workers: Array<Worker>) {
  const columns: TableColumn<Worker>[] = [
    {
      name: "Имя",
      selector: (row: Worker) => row.name,
      sortable: true
    },
    {
      name: "Фамилия",
      selector: (row: Worker) => row.surname,
      sortable: true
    },
    {
      name: "Отчество",
      selector: (row: Worker) => row.last_name,
      sortable: true
    },
    {
      name: "Телефон",
      selector: (row: Worker) => row.phone_number,
      sortable: true
    },
    {
      name: "Почта",
      selector: (row: Worker) => row.email,
      sortable: true
    },
    {
      name: "Роль",
      selector: (row: Worker) => row.role_name,
      sortable: true
    }
  ];

  return <DataTable
    title="Employess"
    columns={columns}
    data={workers}
    defaultSortFieldId="name"
    pagination
    selectableRows
  />
}

export default Page;
