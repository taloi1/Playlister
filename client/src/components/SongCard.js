import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const { song, index } = props;

    let currentSong = (index === store.playingSong);
    useEffect(() => {
        currentSong = (index === store.playingSong);
    }, []);

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        if (store.currentList.isPublished === false) {
            let targetIndex = index;
            let sourceIndex = Number(event.dataTransfer.getData("song"));
            setDraggedTo(false);

            // UPDATE THE LIST
            store.addMoveSongTransaction(sourceIndex, targetIndex);
        }
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        console.log(index + " INDEXXXXXXXXXXXXXXXXXXX");
        console.log(store.playingSong + " SONGGG");
        currentSong = (index === store.playingSong);
        if (event.detail === 2 && store.currentList.isPublished === false) {
            store.showEditSongModal(index, song);
        }
    }

    let cardDraggable = "true";
    if (store.currentList.isPublished === true) {
        cardDraggable = "false";
    }

    let deleteSongButton = <input
        type="button"
        id={"remove-song-" + index}
        className="list-card-button"
        value={"\u2715"}
        onClick={handleRemoveSong}
    />
    if (store.currentList.isPublished === true) {
        deleteSongButton = "";
    }

    let cardClass = "list-card unselected-list-card";
    if (store.currentList.isPublished) {
        cardClass = "list-card published-list-card";
    }

    if (store.currentList && store.playingList) {
        if (store.currentList._id === store.playingList._id) {
            if (currentSong) {
                console.log("PLAYING SONG: " + store.playingSong);
                if (store.currentList.isPublished) {
                    cardClass += " playing-song";
                } else {
                    cardClass += " playing-song-unpublished";
                }
            }
        }
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable={cardDraggable}
            onClick={handleClick}
        >
            {index + 1}. {' '}
            <a
                id={'song-' + index + '-link'}
                className="song-link"
            >
                {song.title} by {song.artist}
            </a>
            {deleteSongButton}
        </div>
    );
}

export default SongCard;