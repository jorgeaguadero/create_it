import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';

import './App.css';

import Navbar from './Navbar';
import Footer from './Footer';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Profile from './Users/Profile';
import Spaces from './Spaces/Spaces';
import Rooms from './Rooms/Rooms';

function App() {
    return (
        <div className="App">
            <Helmet>
                <title>Create It</title>
            </Helmet>
            <Navbar />
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/Login" exact>
                    <Login />
                </Route>
                <Route path="/Signup" exact>
                    <Signup />
                </Route>
                <Route path="/Profile" >
                    <Profile />
                </Route>
                <Route path="/Spaces" exact>
                    <Spaces />
                </Route>
                <Route path="/Buscador" exact>
                    <Rooms />
                </Route>

                {<Route path="/">Not Found </Route>}
            </Switch>
            <Footer />
        </div>
    );
}

export default App;
