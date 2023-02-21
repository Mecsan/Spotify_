import React from 'react'
import { useNavigate } from 'react-router-dom'
import { image } from '../config/api';

function ArtistItem({ artist }) {
    const navigate = useNavigate();
    return (
        <div className="artist" onClick={() => { navigate("/artist/" + artist._id) }}>
            <img src={image + artist.logo} />
            <span>{artist.name}</span>
        </div>
    )
}

export default ArtistItem