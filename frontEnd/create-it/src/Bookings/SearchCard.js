import React from 'react';
import './searchCard.css';

import CreateBooking from './CreateBooking'

import { NavLink } from 'react-router-dom';
export const SearchCard = ({r, start_date}) => {
    return (
        <div className="card">
            <div className="card-content">
                <h2>{r[0].id_room}</h2>
                <br />
                <span>{r[0].room_code}</span>
                <CreateBooking id_room={r[0].id_room} start_date={start_date} />
                <br />
            </div>
        </div>
    );
};

export default SearchCard;
