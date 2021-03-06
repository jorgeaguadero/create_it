import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';

import './App.css';

import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

import Home from './Home';
import Login from './Users/Login';
import Rooms from './Rooms/Rooms';
import Signup from './Users/Signup';
import Profile from './Users/Profile';
import Spaces from './Spaces/Spaces';
import Search from './Bookings/Search';
import RecoveryPassword from './Users/RecoveryPassword';
import ResetRecoveryPassword from './Users/ResetRecoveryPassword';
import VerifyUser from './Users/VerifyUser';

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
                <Route path="/Profile">
                    <Profile />
                </Route>
                <Route path="/Spaces" exact>
                    <Spaces />
                </Route>
                <Route path="/Buscador" exact>
                    <Search />
                </Route>
                <Route path="/Rooms/:id_space" exact>
                    <Rooms />
                </Route>

                <Route path="/user/recoveryPassword" exact>
                    <RecoveryPassword />
                </Route>
                <Route path="/user/verify/:id_user/:activationCode" exact>
                    <VerifyUser />
                </Route>
                <Route path="/user/recoveryPassword/:id_user/:activationCode" exact>
                    <ResetRecoveryPassword />
                </Route>

                {<Route path="/">Not Found </Route>}
            </Switch>
            <Footer />
        </div>
    );
}

export default App;
