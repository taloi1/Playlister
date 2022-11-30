import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function NewSongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    function handleClick() {
        store.addNewSong();
    }

    let cardClass = "list-card unselected-list-card new-song-card";
    return (
        <div
            onClick={handleClick}
            className = {cardClass}
        >
            +
        </div>
    );
}

export default NewSongCard;