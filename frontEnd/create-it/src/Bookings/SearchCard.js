import React from 'react';
import './searchCard.css';

import { NavLink } from 'react-router-dom';
export const SearchCard = ({r}) => {
    return (
        <div className="card">
            <div className="card-content">
                <h2>{r.id_room}</h2>
                <br />
                <span>{r.room_code}</span>
                <br />
            </div>
        </div>
    );
};

export default SearchCard;
