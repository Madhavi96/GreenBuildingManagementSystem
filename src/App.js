import React, { Component } from 'react';
import logo from './bulb.svg';
import './App.css';
import Customers from './Floors'
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Panel from 'react-bootstrap/lib/Panel'


class App extends Component {
  render() {
    console.log("Host URL"+process.env.PUBLIC_URL);
    return (

      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
        <header className="App-header">
        <Panel className="centeralign">
          <Panel.Heading variant="default" style={{ color: "black", background: "grey", opacity: "0.8" }} >
            <Panel.Title componentClass="h3"><b>Go Green Building Energy Management</b></Panel.Title>
            <img src={logo} className="App-logo" alt="logo" />

          </Panel.Heading>         
        </Panel>


        </header>
          <Switch>
                <Route exact path= "/" render={() => (
                  <Redirect to="/customerlist"/>
                )}/>
                 <Route exact path='/customerlist' component={Customers} />
          </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
