import React, {useState} from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from 'pages/home/home';
// import {Row,Container,Col,Button} from 'react-bootstrap';
import Navigation from 'components/Navigation/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'misc/_common.scss';
// import Shop from 'pages/shop/shop';
// import Signup from 'pages/signup/signup';
// import Signin from 'pages/signin/signin';
import Auth from 'pages/auth/auth';
import Dashboard from 'pages/dashboard/dashboard';
import Room from 'pages/room/room';
// import Signin from 'pages/signin/signin';
// import Signup from 'pages/signup/signup';

function App() {
  const [logged,setLogged] = useState(0);
  // const [auth,setAuth] = useState(0);

  return (
    <Router>
      <Navigation logged={logged} setLogged={setLogged}/>
      {!logged?
      <Switch>
        <Route exact path="/room">
          <Room/>
        </Route> 

        <Route exact path="/volunteer">
          <Auth logged={logged} setLogged={setLogged}/>
        </Route> 

        <Route path="/">
          <Home/>
        </Route>
      </Switch>
  :
      <Switch>
        <Route path='/dashboard' exact component={() => <Dashboard setLogged={setLogged }/>}/>
        <Route path='/' render={() => <Redirect to="/dashboard"/>}/>
      </Switch>
}
</Router>
  );
}

export default App;
