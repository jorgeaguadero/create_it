import { Route, Switch } from 'react-router-dom';
import Helmet from 'react-helmet';

import './App.css';

import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

import Home from './Home';
import Login from './Users/Login';
import Signup from './Users/Signup';
import Profile from './Users/Profile';
import Spaces from './Spaces/Spaces';
import Search from './Bookings/Search';
import ErrorMessage from './ErrorMessage';

function App() {
    return (
        <div className="App">
            <ErrorMessage />
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

                {<Route path="/">Not Found </Route>}
            </Switch>
            <Footer />
        </div>
    );
}

export default App;
