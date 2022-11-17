import { IonButtons, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonText, IonButton, IonInput, IonModal, IonSelect, IonSelectOption } from '@ionic/react';
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
import React, { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from "react-data-table-component";
import Modal from '../components/modal';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';

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

interface Worker {
  id: number,
  name: string,
  surname: string,
  last_name: string,
  phone_number: string,
  email: string,
  role_name: string
}

interface Role {
  id: number,
  name: string
}

const Page: React.FC = () => {
  const [SelectedRowsAll, setSelectedRows] = React.useState(Array<Worker>);
  const [admins, setAdmins] = React.useState(null as Array<Worker> | null);
  const [roles, setRoles] = React.useState( null as Array<Role> | null);
  const { name } = useParams<{ name: string; }>();
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

  React.useEffect(() =>  {
    axios
      .get("https://api.necrom.ru/worker?join=true")
      .then((response) => setAdmins(response.data));
    axios
    .get("https://api.necrom.ru/worker_role?join=true")
    .then((response) => setRoles(response.data));
    ;
  });

  function changeRowPerPage(selected:any) {
        setSelectedRows(selected.selectedRows);
  }
  

  function clickDeleteItems(){
    // запрос на api[DELETE]
    console.log('deleted', SelectedRowsAll)
    window.location.reload()
  }

  function clickUpdateItem(){
    //open modal
    console.log('updated', SelectedRowsAll);
  }

  
    const modalAdd = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);
  
  
    function confirm() {
      modalAdd.current?.dismiss(input.current?.value, 'confirm');
    }
  
  // function getRoles(){
  //   axios
  //     .get("https://api.necrom.ru/worker_role?join=true")
  //     .then((response) => setRoles(response.data));
  //   roles.map(function retResult(element:any){
  //     return (
  //       <IonSelectOption value={element.name}>{element.name}</IonSelectOption>
  //     )
  //   })
  //   // for ( let role of roles ) {
  //   //   result = result + "<IonSelectOption value='" + role.name + "'>" + role.name + "</IonSelectOption>"
  // }
  // }

  return (
    <IonPage>
      <IonModal ref={modalAdd} trigger="open-modal">
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => modalAdd.current?.dismiss()}>Cancel</IonButton>
                </IonButtons>
                <IonTitle>Welcome</IonTitle>
                <IonButtons slot="end">
                  <IonButton strong={true} onClick={() => confirm()}>
                    Confirm
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              
              <IonItem>
                <IonLabel position="stacked">Имя</IonLabel>
                <IonInput ref={input} type="text" placeholder="Введите имя" />
                <IonLabel position="stacked">Фамилия</IonLabel>
                <IonInput ref={input} type="text" placeholder="Введите фамилию" />
                <IonLabel position="stacked">Отчество</IonLabel>
                <IonInput ref={input} type="text" placeholder="Введите отчество" />
                <IonLabel position="stacked">Телефон</IonLabel>
                <IonInput ref={input} type="text" placeholder="Введите телефон" />
                <IonLabel position="stacked">Почта</IonLabel>
                <IonInput ref={input} type="text" placeholder="Введите почту" />
                <IonLabel position="stacked">Роль</IonLabel>
                <IonSelect placeholder="Select fruit">
                  {
                  roles?.map(function retResult(element:any){
                  return (
                    <IonSelectOption value={element.name}>{element.name}</IonSelectOption>
                  )
                }) }
                  {/* <IonSelectOption value="apples">Apples</IonSelectOption>
                  <IonSelectOption value="oranges">Oranges</IonSelectOption>
                  <IonSelectOption value="bananas">Bananas</IonSelectOption> */}
                </IonSelect>
              </IonItem>
            </IonContent>
          </IonModal>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Managers</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList id="inbox-list" >
        <IonButton  routerDirection="none" id="open-modal">
            <IonLabel>Add Manager</IonLabel>
        </IonButton>
        </IonList>
        <br></br><br></br><br></br>
          <h4>List Managers:</h4>
          {(SelectedRowsAll?.length > 0 ) ? <IonButton color="danger" onClick={clickDeleteItems}>Удалить</IonButton> : ""}
          {(SelectedRowsAll?.length === 1 ) ? <IonButton color="secondary" id={'open-modal777777'} onClick={clickUpdateItem}>Изменить</IonButton> : ""}
        <IonList id="admins-list">
          {
            (admins === null) ?
              <IonTitle>Загрузка...</IonTitle> :
              <DataTable
                title="Employess"
                columns={columns}
                data={admins}
                defaultSortFieldId="name"
                onSelectedRowsChange={changeRowPerPage}
                pagination
                selectableRows
              />
          }
        </IonList>
        
      </IonContent>
    </IonPage>
  );
};

// function GenerateWorkersTable(workers: Array<Worker>) {
//   const columns: TableColumn<Worker>[] = [
//     {
//       name: "Имя",
//       selector: (row: Worker) => row.name,
//       sortable: true
//     },
//     {
//       name: "Фамилия",
//       selector: (row: Worker) => row.surname,
//       sortable: true
//     },
//     {
//       name: "Отчество",
//       selector: (row: Worker) => row.last_name,
//       sortable: true
//     },
//     {
//       name: "Телефон",
//       selector: (row: Worker) => row.phone_number,
//       sortable: true
//     },
//     {
//       name: "Почта",
//       selector: (row: Worker) => row.email,
//       sortable: true
//     },
//     {
//       name: "Роль",
//       selector: (row: Worker) => row.role_name,
//       sortable: true
//     }
//   ];

//   const [SelectedRowsAll, setSelectedRows] = React.useState(null as Array<Worker> | null);
//   function changeRowPerPage(selected:any) {
//     setSelectedRows(selected.selectedRows);
//     console.log(selected.allSelected, selected.selectedCount, selected.selectedRows);
//     console.log('huk', SelectedRowsAll);
//   }

//   return <DataTable
//     title="Employess"
//     columns={columns}
//     data={workers}
//     defaultSortFieldId="name"
//     onSelectedRowsChange={(selected) => {setSelectedRows(selected.selectedRows);
//       console.log(selected.allSelected, selected.selectedCount, selected.selectedRows);
//       console.log('huk', SelectedRowsAll);}}
//     pagination
//     selectableRows
//   />
// }


export default Page;

