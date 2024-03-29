import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    p: 4,
};

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong() {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong() {
        store.hideModals();
    }

    let modalClass = "modal";
    if (store.isRemoveSongModalOpen()) {
        modalClass += " is-visible";
    }
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Modal
            open={store.currentSong !== null}
            BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, .05)" } }}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                    <div className="modal-header">
                        Remove {songTitle}?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently remove {songTitle} from the playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button"
                            id="remove-song-confirm-button"
                            className="modal-button"
                            onClick={handleConfirmRemoveSong}
                            value='Confirm' />
                        <input
                            type="button"
                            id="remove-song-cancel-button"
                            className="modal-button"
                            onClick={handleCancelRemoveSong}
                            value='Cancel' />
                    </div>
                </div>
            </Box>
        </Modal>
    );
}