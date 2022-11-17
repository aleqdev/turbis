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
  // const { name } = useParams<{ name: string; }>();
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
    setModalIsOpen(true);
    const input_upd_email = document.getElementById("input_upd_email")
    input_upd_email?.setAttribute('value', SelectedRowsAll[0].email)
    console.log('updated', SelectedRowsAll[0].email);
    // setUser_upd_name(SelectedRowsAll[0].name)
    // setUpd_surname(SelectedRowsAll[0].surname)
    // setUpd_last_name(SelectedRowsAll[0].last_name)
    // setUpd_phone_number(SelectedRowsAll[0].phone_number)
    // setUpd_email(SelectedRowsAll[0].email)
    // setRoleUpd(SelectedRowsAll[0].role_name)
  }

  
    const modalAdd = useRef<HTMLIonModalElement>(null);
    const modalUpdate = useRef<HTMLIonModalElement>(null);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [user_upd_role, setRoleUpd] = React.useState("");
    const [user_upd_name, setUser_upd_name] = React.useState<any>("");
    const [upd_surname, setUpd_surname] = React.useState("");
    const [upd_last_name, setUpd_last_name] = React.useState("");
    const [upd_phone_number, setUpd_phone_number] = React.useState("");
    const [upd_email, setUpd_email] = React.useState("");
    // const [user_upd_email, setUser_upd_email] = useRecoilState("");

    const name = useRef<HTMLIonInputElement>(null);
    const surname = useRef<HTMLIonInputElement>(null);
    const last_name = useRef<HTMLIonInputElement>(null);
    const phone_number = useRef<HTMLIonInputElement>(null);
    const email = useRef<HTMLIonInputElement>(null);
    const [user_role, setSelectRole] = React.useState("");
    const [error_mess_add, setError_mess_add] = React.useState("");
    const [error_mess_upd, setError_mess_upd] = React.useState("");

    function confirmUpd() {
      setError_mess_upd("")
      if
        (user_upd_name && upd_surname && upd_email && upd_last_name && upd_phone_number && user_upd_role) {
          // API[POST] запрос на добавление manager
          console.log(user_upd_name, upd_surname, upd_email, upd_last_name, upd_phone_number, user_upd_role)
          console.log('Все заполненно')
          modalUpdate.current?.dismiss(name.current?.value, 'confirm');
        } else {
          setError_mess_upd('Одно из полей не заполненно')
          console.log('error что-то не заполненно')
        }
      console.log('тут')
    }


    function confirm() {
      setError_mess_add("")
      let user_name = name.current?.value
      let user_surname = surname.current?.value
      let user_last_name = last_name.current?.value
      let user_phone_number = phone_number.current?.value
      let user_email = email.current?.value
      if
        (user_name && user_surname && user_email && user_last_name && user_phone_number && user_role) {
          // API[POST] запрос на добавление manager
          console.log(user_name, user_surname, user_last_name, user_role, user_email, user_phone_number)
          console.log('Все заполненно')
          modalAdd.current?.dismiss(name.current?.value, 'confirm');
        } else {
          setError_mess_add('Одно из полей не заполненно')
          console.log('error что-то не заполненно')
        }
      console.log('тут')
    }

  
  return (
    <IonPage>
      <IonModal ref={modalAdd} trigger="open-modal">
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => modalAdd.current?.dismiss()}>Cancel</IonButton>
                </IonButtons>
                <IonTitle>Add Manager</IonTitle>
                <IonButtons slot="end">
                  <IonButton strong={true} onClick={() => confirm()}>
                    Confirm
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              
              <IonItem>
              {(error_mess_add != "") ? <IonText color={'danger'}> {error_mess_add}</IonText> : ""}
                <IonLabel position="stacked">Имя</IonLabel>
                <IonInput ref={name} type="text" placeholder="Введите имя" required/>
                <IonLabel position="stacked">Фамилия</IonLabel>
                <IonInput ref={surname} type="text" placeholder="Введите фамилию" required/>
                <IonLabel position="stacked">Отчество</IonLabel>
                <IonInput ref={last_name} type="text" placeholder="Введите отчество" required/>
                <IonLabel position="stacked">Телефон</IonLabel>
                <IonInput ref={phone_number} type="text" placeholder="Введите телефон" required/>
                <IonLabel position="stacked">Почта</IonLabel>
                <IonInput ref={email} type="text" placeholder="Введите почту" required/>
                <IonLabel position="stacked" >Роль</IonLabel>
                <IonSelect placeholder="Select role" onIonChange={(ev) => setSelectRole(ev.target.value)}>
                  {
                  roles?.map(function retResult(element:any){
                  return (
                    <IonSelectOption value={element.name}>{element.name}</IonSelectOption>
                  )
                }) }
                </IonSelect>
              </IonItem>
            </IonContent>
      </IonModal>

      <IonModal ref={modalUpdate} isOpen={modalIsOpen} trigger="open-modal-upd">
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => {modalUpdate.current?.dismiss(); setModalIsOpen(false) }}>Cancel</IonButton>
                </IonButtons>
                <IonTitle>Update Manager</IonTitle>
                <IonButtons slot="end">
                  <IonButton strong={true} onClick={() => confirmUpd()}>
                    Confirm
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              
              <IonItem>
              {(error_mess_upd != "") ? <IonText color={'danger'}> {error_mess_upd}</IonText> : ""}
                <IonLabel position="stacked">Имя</IonLabel>
                <IonInput value={user_upd_name} onIonChange={(ev) => setUser_upd_name(ev.target.value) } type="text" placeholder="Введите имя" required/>
                <IonLabel position="stacked">Фамилия</IonLabel>
                <IonInput value={upd_surname} type="text" placeholder="Введите фамилию" required/>
                <IonLabel position="stacked">Отчество</IonLabel>
                <IonInput value={upd_last_name} type="text" placeholder="Введите отчество" required/>
                <IonLabel position="stacked">Телефон</IonLabel>
                <IonInput value={upd_phone_number} type="text" placeholder="Введите телефон" required/>
                <IonLabel position="stacked">Почта</IonLabel>
                <IonInput value="" id="input_upd_email" type="text" placeholder="Введите почту" required/>
                <IonLabel position="stacked" >Роль</IonLabel>
                <IonSelect  placeholder="Select role" onIonChange={(ev) => setRoleUpd(ev.target.value)}>
                  {
                  roles?.map(function retResult(element:any){
                  return (
                    <IonSelectOption value={element.name}>{element.name}</IonSelectOption>
                  )
                }) }
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
            <IonTitle size="large">Admins</IonTitle>
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
          {(SelectedRowsAll?.length === 1 ) ? <IonButton color="secondary" id='open-modal-upd' onClick={() => {clickUpdateItem(); setModalIsOpen(true);}}>Изменить</IonButton> : ""}
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


export default Page;

function useRecoilState(refLinkState: any): [any, any] {
  throw new Error('Function not implemented.');
}

