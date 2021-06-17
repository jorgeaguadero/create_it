import {  Redirect} from 'react-router-dom';
import './Profile.css';
import { useSelector } from 'react-redux';


import ProfileUser from './ProfileUser';
import ProfileAdmin from './ProfileAdmin';

function Profile() {
    const me = useSelector((s) => s.user);

    if (!me) return <Redirect to="/login" />;

    return me.role === 'admin' ? <ProfileAdmin /> : <ProfileUser />;

  
}

export default Profile;
