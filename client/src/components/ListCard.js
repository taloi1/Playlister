import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import SongCard from './SongCard'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import NewSongCard from './NewSongCard'
import EditToolbar from './EditToolbar'

import Box from '@mui/material/Box';
import { List } from '@mui/material';
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
        cardCenter = 
        <Box sx={{ width: '100%', backgroundColor: "#fffff1", height: "40vh", overflowY: "auto", 
        borderStyle: "solid", borderWidth: "2px", borderRadius: '10pt'}}>
        <List 
        id="playlist-cards" 
        
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
        <NewSongCard/>
        </List>    
        </Box>
          
    }

    let editToolbar = "";
    if (store.currentList && store.currentList._id === idNamePair._id) {
        editToolbar= <Box style={{width: '100%', marginTop: '2%', marginBottom: '2%' }}><EditToolbar></EditToolbar></Box>
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
        }} aria-label='close'
        >
        <KeyboardDoubleArrowUpIcon style={{fontSize:'48pt'}} />
        </IconButton>
    } else {
        listOpenCloseButton = <IconButton onClick={(event) => {
            handleLoadList(event, idNamePair._id)
        }} aria-label='open'
        >
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
        sx={{ flexDirection: 'column', borderStyle: "solid", borderRadius: "10px",  borderWidth: "2px", backgroundColor: "#fffff1", marginTop: '2%' }}
        id={idNamePair._id}
        key={idNamePair._id}
        >
            <Box //TOP
            sx={{ marginTop: '10px', display: 'flex', p: 1, paddingBottom: 0, paddingTop: 0}}
            style={{ minHeight: '80px', height:'6%', width: '100%', fontSize: '20pt', position: 'relative'}}    
            onClick={handleToggleEdit}
            >
            <Box sx={{ flexGrow: 1, overflowX: 'auto', top: '6%', left: '3%', position: 'absolute' }}>{idNamePair.name}</Box>
            <Box sx={{ flexGrow: 1, overflowX: 'auto', top: '56%', left: '3%', position: 'absolute', fontSize: '15pt' }}>By: Me :D</Box>
            <Box sx={{ top: '0%', left: '55%', position: 'absolute'}}>
                <IconButton onClick={handleLikeList} aria-label='like'>
                    <ThumbUpAltIcon style={{fontSize:'40pt'}}> </ThumbUpAltIcon>
                </IconButton>
                1000
                <IconButton onClick={(event) => {
                        handleDislikeList()
                    }} aria-label='dislike' style={{marginLeft: '1pt'}}>
                    <ThumbDownAltIcon style={{fontSize:'40pt'}} />
                </IconButton>
                2
            </Box>
            </Box>

            {cardCenter}
            {editToolbar}

            <Box //BOTTOM
                sx={{display: 'flex', p: 1, paddingBottom: 0, paddingTop: 0}}
                style={{ minHeight: '80px', height:'6%', width: '100%', fontSize: '15pt', position: 'relative'}}
                onClick={handleToggleEdit}
            >
                <Box sx={{ flexGrow: 1, overflowX: 'auto', bottom: '6%', left: '3%', position: 'absolute' }}>Published: Jan 5, 2019</Box>
                <Box sx={{ flexGrow: 1, overflowX: 'auto', bottom: '6%', left: '55%', position: 'absolute'  }}>Listens: 727</Box>
                <Box sx={{ bottom: '0%', right: '3%', position: 'absolute' }}>
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