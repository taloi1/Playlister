import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import SongCard from './SongCard'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'

import Box from '@mui/material/Box';
import { List } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const playlist = async() => {await store.getPlaylist(idNamePair._id)};
    
    
    

    function handleLoadList(event, id) {
        store.clearAllTransactions();
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }   

    function handleCloseList () {
        store.closeCurrentList();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        if (event.detail === 2) {
            toggleEdit();
        }
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    
    function handleLikeList(event, id) {
        console.log(playlist);
        console.log("Like");
    }

    function handleDislikeList(event, id) {
        console.log("Dislike");
        console.log(idNamePair);
    }

    let cardCenter = "";
    if (store.currentList && store.currentList._id === idNamePair._id) {
        cardCenter = <List 
        id="playlist-cards" 
        sx={{ width: '100%', bgcolor: 'background.paper', height: "40vh", overflowY: "auto"}}
        >
        {
            store.currentList.songs.map((song, index) => (
                <SongCard
                    id={'playlist-song-' + (index)}
                    key={'playlist-song-' + (index)}
                    index={index}
                    song={song}
                />
            ))  
            
        }
        </List>;          
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let listOpenCloseButton = "";
    if (store.currentList && store.currentList._id === idNamePair._id) {
        listOpenCloseButton = <IconButton onClick={(event) => {
            handleCloseList(event, idNamePair._id)
        }} aria-label='close'>
        <KeyboardDoubleArrowUpIcon style={{fontSize:'48pt'}} />
        </IconButton>
    } else {
        listOpenCloseButton = <IconButton onClick={(event) => {
            handleLoadList(event, idNamePair._id)
        }} aria-label='open'>
        <KeyboardDoubleArrowDownIcon style={{fontSize:'48pt'}} />
        </IconButton>
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
        <ListItem 
        sx={{ flexDirection: 'column' }}
        id={idNamePair._id}
        key={idNamePair._id}
        >
            <Box //TOP
            sx={{ marginTop: '10px', display: 'flex', p: 1, paddingBottom: 0, paddingTop: 0}}
            style={{ minHeight: '100px', height:'6%', width: '100%', fontSize: '25pt', 
            borderStyle: "solid", borderRadius: "10px 10px 0px 0px",  borderWidth: "2px", borderBottom: 0, backgroundColor: "#fffff1"}}    
            onClick={handleToggleEdit}
            >
            <Box sx={{ p: 1, flexGrow: 1, overflowX: 'auto' }}>{idNamePair.name}</Box>
            <Box sx={{ p: 1, flexGrow: 1, overflowX: 'auto', top: '30%', position: 'absolute' }}>By</Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleLikeList} aria-label='like'>
                    <ThumbUpAltIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDislikeList()
                    }} aria-label='dislike'>
                    <ThumbDownAltIcon style={{fontSize:'48pt'}} />
                </IconButton>
            </Box>
            </Box>

            {cardCenter}

            <Box //BOTTOM
                sx={{display: 'flex', p: 1, paddingBottom: 0, paddingTop: 0}}
                style={{ minHeight: '100px', height:'6%', width: '100%', fontSize: '25pt', 
                borderStyle: "solid", borderRadius: "0px 0px 10px 10px", borderWidth: "2px", borderTop: 0, backgroundColor: "#fffff1"}}
                onClick={handleToggleEdit}
            >
                <Box sx={{ p: 1, flexGrow: 1, overflowX: 'auto' }}>published listens</Box>
                <Box sx={{ p: 1 }}>
                    {listOpenCloseButton}
                </Box>
            </Box>

            {modalJSX}
        </ListItem>
        

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                variant="filled"
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;