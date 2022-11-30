import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);


    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleDelete() {
        if (store.currentList) {
            store.markListForDeletion(store.currentList._id);
        }
    }

    return (
        <div id="edit-toolbar">
            <Box style={{position:'absolute',left:'2%', width:'50%', top:'0%'}}>
            <Button 
                disabled={!store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={!store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            </Box>
            <Box style={{position:'absolute', right:'2%', width:'50%'}}>
            <Button 
                style={{position:'absolute', right:'0%'}}
                id='close-button'
                onClick={handleDelete}
                variant="contained">
                    <CloseIcon />
            </Button>
            </Box>
        </div>
    )
}

export default EditToolbar;