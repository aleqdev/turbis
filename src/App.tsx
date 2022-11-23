import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Hotels from './pages/Hotels';
import Regions from './pages/Regions'
import Employees from './pages/Employees'
import EmployeeRoles from './pages/EmployeeRoles'
import Clients from './pages/Clients'
import ClientTypes from './pages/ClientTypes'

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

setupIonicReact();


const App: React.FC = () => {
  let auth = {
    email: "primitive_email@not.even.valid",
    password: "primitive_password"
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu/>
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/page/hotels" />
            </Route>
            <Route path="/page/Hotels" exact={true}>
              <Hotels auth={auth} />
            </Route>
            {
            <Route path="/page/Tours" exact={true}>
              <Tours auth={auth} />
            </Route>
            }
            <Route path="/page/Regions" exact={true}>
              <Regions auth={auth} />
            </Route>
            <Route path="/page/Employees" exact={true}>
              <Employees auth={auth} />
            </Route>
            <Route path="/page/EmployeeRoles" exact={true}>
              <EmployeeRoles auth={auth} />
            </Route>
            <Route path="/page/Persons" exact={true}>
              <Persons auth={auth} />
            </Route>
            <Route path="/page/Clients" exact={true}>
              <Clients auth={auth} />
            </Route>
            <Route path="/page/ClientTypes" exact={true}>
              <ClientTypes auth={auth} />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
