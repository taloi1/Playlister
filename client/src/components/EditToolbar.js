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

    if (!auth.user) {
        return;
    }

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
    let buttonStyle = { backgroundColor: '#dddddd', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px', marginLeft: '2px' }
    let deleteButton = <Button
        style={buttonStyle}
        id='delete-button'
        onClick={handleDelete}
        variant="contained">
        Delete
    </Button>;
    if (auth.user.userName !== listInfo.ownerUserName) {
        deleteButton = "";
    }
    let undoButtonStyle = { backgroundColor: '#dddddd', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px', marginRight: '2px' }
    if (!store.canUndo()) {
        undoButtonStyle = { backgroundColor: '#777777', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px', marginRight: '2px' }
    }
    let redoButtonStyle = { backgroundColor: '#dddddd', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px', marginRight: '2px' }
    if (!store.canRedo()) {
        redoButtonStyle = { backgroundColor: '#777777', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111', borderRadius: '8px', marginRight: '2px' }
    }
    
    let undoRedoBox = <Box style={{ position: 'absolute', left: '1%', width: 'auto', top: '0%'}}>
        <Button
            style={undoButtonStyle}
            disabled={!store.canUndo()}
            id='undo-button'
            onClick={handleUndo}
            variant="contained">
            Undo
        </Button>
        <Button
            style={redoButtonStyle}
            disabled={!store.canRedo()}
            id='redo-button'
            onClick={handleRedo}
            variant="contained">
            Redo
        </Button>
    </Box>;

    let publishButton = <Button
        style={buttonStyle}
        id='publish-button'
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
            <Box style={{ position: 'absolute', right: '1%', width: 'auto'}}>
                {publishButton}
                {deleteButton}
                <Button
                    style={buttonStyle}
                    id='duplicate-button'
                    onClick={handleDuplicate}
                    variant="contained">
                    Duplicate
                </Button>
            </Box>
        </div>
    )
}

export default EditToolbar;