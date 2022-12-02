import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar(props) {
    const { listInfo } = props;
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);


    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handlePublish() {
        if (store.currentList) {
            store.publishList(listInfo._id);
        }
    }
    function handleDelete() {
        if (store.currentList) {
            store.markListForDeletion(listInfo._id);
        }
    }
    function handleDuplicate() {
        if (store.currentList) {
            store.duplicateList(listInfo._id);
        }
    }

    let deleteButton = <Button 
    id='close-button'
    onClick={handleDelete}
    variant="contained">
        Delete
    </Button>;
    if (auth.user.userName !== listInfo.ownerUserName) {
        deleteButton = "";
    }

    let undoRedoBox = <Box style={{position:'absolute',left:'2%', width:'auto', top:'0%'}}>
    <Button 
        disabled={!store.canUndo()}
        id='undo-button'
        onClick={handleUndo}
        variant="contained">
            Undo
    </Button>
    <Button 
        disabled={!store.canRedo()}
        id='redo-button'
        onClick={handleRedo}
        variant="contained">
            Redo
    </Button>
    </Box>;

    let publishButton = <Button 
    id='close-button'
    onClick={handlePublish}
    variant="contained">
        Publish
    </Button>;

    if (listInfo.isPublished) {
        undoRedoBox = "";
        publishButton = "";
    }
    
    

    return (
        <div id="edit-toolbar">
            {undoRedoBox}
            <Box style={{position:'absolute', right:'2%', width:'auto'}}>
            {publishButton}
            {deleteButton}
            <Button 
                id='close-button'
                onClick={handleDuplicate}
                variant="contained">
                    Duplicate
            </Button>
            </Box>
        </div>
    )
}

export default EditToolbar;