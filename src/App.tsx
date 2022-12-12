import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Hotels from './pages/Hotels';
import Regions from './pages/Regions'
import Employees from './pages/Employees'
import EmployeeRoles from './pages/EmployeeRoles'
import TourOrders from './pages/TourOrders'
import TourOrderPayments from './pages/TourOrderPayments'
import TourOrderPurchases from './pages/TourOrderPurchases'
import TourOrderPaymentTypes from './pages/TourOrderPaymentTypes'
import TourOrderTurnover from './pages/TourOrderTurnover'
import Clients from './pages/Clients'
import ClientTypes from './pages/ClientTypes'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { set as setAuth } from './redux/auth';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'; 
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Persons from './pages/Persons';
import Tours from './pages/Tours';
import InfoPage from './pages/InfoPage';

setupIonicReact();


const App: React.FC = () => {
  store.dispatch(setAuth({
    email: "primitive_email@not.even.valid",
    password: "primitive_password"
  }));

  return (
    <Provider store={store}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu/>
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Redirect to="/page/hotels" />
              </Route>
              <Route path="/page/Hotels" exact={true}>
                <Hotels/>
              </Route>
              <Route path="/page/Tours" exact={true}>
                <Tours/>
              </Route>
              <Route path="/page/Regions" exact={true}>
                <Regions/>
              </Route>
              <Route path="/page/Employees" exact={true}>
                <Employees/>
              </Route>
              <Route path="/page/EmployeeRoles" exact={true}>
                <EmployeeRoles/>
              </Route>
              <Route path="/page/TourOrders" render={(props) => <TourOrders params={props.match.params}/>}/>
              <Route path="/page/TourOrders/:filter" render={(props) => <TourOrders params={props.match.params}/>}/>
              <Route path="/page/TourOrderPaymentTypes" exact={true}>
                <TourOrderPaymentTypes/>
              </Route>
              <Route path="/page/TourOrderPayments" exact={true}>
                <TourOrderPayments/>
              </Route>
              <Route path="/page/TourOrderPurchases" exact={true}>
                <TourOrderPurchases/>
              </Route>
              <Route path="/page/TourOrderTurnover" exact={true}>
                <TourOrderTurnover/>
              </Route>
              <Route path="/page/Persons" exact={true}>
                <Persons/>
              </Route>
              <Route path="/page/Info" exact={true}>
                <InfoPage />
              </Route>
              <Route path="/page/Clients" exact={true}>
                <Clients/>
              </Route>
              <Route path="/page/ClientTypes" exact={true}>
                <ClientTypes/>
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </Provider>
  );
};

export default App;
