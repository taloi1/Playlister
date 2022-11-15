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

export default function MUIDeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
    }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.hideModals();
    }

    return (
        <Modal
            open={store.listMarkedForDeletion !== null}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                    <header className="modal-header">
                        Delete the {name} Playlist?
                    </header>
                    <div id="modal-south">
                        <input 
                            type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            value='Confirm' 
                            onClick={handleDeleteList} />
                        <input 
                            type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            value='Cancel' 
                            onClick={handleCloseModal} />
                    </div>
                </div>
            </Box>
        </Modal>
    );
}