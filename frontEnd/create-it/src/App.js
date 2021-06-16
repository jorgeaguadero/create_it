import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';

import './App.css';

import Navbar from './Navbar';
import Footer from './Footer';

import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Spaces from './Spaces';

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
                <Route path="/Register" exact>
                    <Register />
                </Route>
                <Route path="/Profile" exact>
                    <Profile />
                </Route>
                <Route path="/Spaces" exact>
                    <Spaces />
                </Route>

                <Route path="/">Not Found </Route>
            </Switch>
            <Footer />
        </div>
    );
}

export default App;
