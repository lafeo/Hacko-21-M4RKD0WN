import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from 'pages/home/home';
import Navigation from 'components/Navigation/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'misc/_common.scss';
import Shop from 'pages/shop/shop';
import Signup from 'pages/signup/signup';
import Signin from 'pages/signin/signin';
import Auth from 'pages/auth/auth';

function App() {

  return (
    <Router>
      <Navigation/>
      <Switch>
        <Route path="/volunteer">
          <Auth/>
        </Route>
        <Route path="/signin">
          <Signin/>
        </Route>
        
        <Route path="/shop">
          <Shop/>
        </Route>
        
        <Route path="/">
          <Home/>
        </Route>
       
      </Switch>
  </Router>
  );
}

export default App;
