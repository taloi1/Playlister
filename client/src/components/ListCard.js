import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import SongCard from './SongCard'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import NewSongCard from './NewSongCard'
import EditToolbar from './EditToolbar'

import Box from '@mui/material/Box';
import { List, Typography } from '@mui/material';
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
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { listInfo, selected } = props;


    function handleOpenList(event) {
        handleLoadList(event, listInfo._id);
    }

    function handleLoadList(event, id) {
        event.stopPropagation();
        store.clearAllTransactions();
        console.log("handleLoadList for " + id);
        let _id = event.target.id;
        if (_id.indexOf('list-card-text-') >= 0)
            _id = ("" + _id).substring("list-card-text-".length);

        console.log("load " + event.target.id);
        // CHANGE THE CURRENT LIST
        store.setCurrentList(id);
    }

    function handleCloseList(event) {
        event.stopPropagation();
        store.closeCurrentList();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        store.setPlayingList(listInfo._id);
        if (event.detail === 2 && !listInfo.isPublished) {
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

    function handleLikeList(event) {
        event.stopPropagation();
        if (auth.user) {
            store.likePlaylist(listInfo._id);
            console.log("Like");
        }

    }

    function handleDislikeList(event) {
        event.stopPropagation();
        if (auth.user) {
            store.dislikePlaylist(listInfo._id);
            console.log("Dislike");
        }

        console.log(listInfo);
    }

    let cardCenter = "";
    let cardCenterStyle = {
        width: '100%', backgroundColor: "#fffff1", height: "35vh", overflowY: "auto",
        borderStyle: "solid", borderWidth: "2px", borderRadius: '10pt'
    };
    if (store.currentList) {
        if (store.currentList.isPublished) {
            cardCenterStyle = {
                width: '100%', backgroundColor: "#2c2f70", height: "35vh", overflowY: "auto",
                borderStyle: "solid", borderWidth: "2px", borderRadius: '10pt'
            };
        }
    }

    if (store.currentList && store.currentList._id === listInfo._id) {
        cardCenter =
            <Box sx={cardCenterStyle}>
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
                    <NewSongCard />
                </List>
            </Box>

    }

    let editToolbar = "";
    if (store.currentList && store.currentList._id === listInfo._id) {
        editToolbar = <Box style={{ width: '100%', marginTop: '2%', marginBottom: '2%' }}><EditToolbar listInfo={listInfo}></EditToolbar></Box>
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let listOpenCloseButton = "";
    if (store.currentList && store.currentList._id === listInfo._id) {
        listOpenCloseButton = <IconButton onClick={(event) => {
            handleCloseList(event, listInfo._id)
        }} aria-label='close'
        >
            <KeyboardDoubleArrowUpIcon style={{ fontSize: '32pt' }} />
        </IconButton>
    } else {
        listOpenCloseButton = <IconButton onClick={(event) => {
            handleOpenList(event);
        }} aria-label='open'
        >
            <KeyboardDoubleArrowDownIcon style={{ fontSize: '32pt' }} />
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

    let listItemStyle = { flexDirection: 'column', borderStyle: "solid", borderRadius: "10px", borderWidth: "2px", backgroundColor: "#fffff1", marginTop: '2%' };
    if (listInfo.isPublished) {
        listItemStyle = { flexDirection: 'column', borderStyle: "solid", borderRadius: "10px", borderWidth: "2px", backgroundColor: "#d4d4f5", marginTop: '2%' };
    }
    if (store.playingList && store.playingList._id === listInfo._id && listInfo.isPublished) {
        listItemStyle = { flexDirection: 'column', borderStyle: "solid", borderRadius: "10px", borderWidth: "4px", backgroundColor: "#d4af37", marginTop: '2%' };
    }
    if (store.playingList && store.playingList._id === listInfo._id && !listInfo.isPublished) {
        listItemStyle = { flexDirection: 'column', borderStyle: "solid", borderRadius: "10px", borderWidth: "4px", backgroundColor: "#fffff1", marginTop: '2%' };
    }


    let publishText = "";
    if (listInfo.publishDate && listInfo.isPublished) {
        publishText = "Published: "
    }
    let published = "";
    if (listInfo.publishDate && listInfo.isPublished) {
        let dateText = listInfo.publishDate.slice(0, 10);
        let dateArray = dateText.split("-")
        let publishDateText = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0]
        published = <Typography display="inline" style={{ color: '#65b358', fontWeight: 'bold' }}> {publishDateText} </Typography>;
    }

    let listensText = "";
    if (listInfo.isPublished) {
        listensText = "Listens: "
    }
    let listens = "";
    if (listInfo.isPublished) {
        listens = <Typography display="inline" style={{ color: '#b33037', fontWeight: 'bold' }}> {listInfo.listens} </Typography>;
    }

    let likeButton = <ThumbUpOffAltIcon style={{ fontSize: '40pt' }}> </ThumbUpOffAltIcon>
    if (listInfo.likedUsers && auth.user) {
        if (listInfo.likedUsers.indexOf(auth.user.userName) !== -1) {
            likeButton = <ThumbUpAltIcon style={{ fontSize: '40pt' }}> </ThumbUpAltIcon>
        }
    }

    let dislikeButton = <ThumbDownOffAltIcon style={{ fontSize: '40pt' }} />
    if (listInfo.dislikedUsers && auth.user) {
        if (listInfo.dislikedUsers.indexOf(auth.user.userName) !== -1) {
            dislikeButton = <ThumbDownAltIcon style={{ fontSize: '40pt' }}> </ThumbDownAltIcon>
        }
    }

    let likeDislikeArea = <Box sx={{ top: '0%', left: '55%', position: 'absolute' }}>
        <IconButton onClick={handleLikeList} aria-label='like'>
            {likeButton}
        </IconButton>
        {listInfo.likes}
        <IconButton onClick={handleDislikeList} aria-label='dislike' style={{ marginLeft: '1pt' }}>
            {dislikeButton}
        </IconButton>
        {listInfo.dislikes}
    </Box>;
    if (listInfo.isPublished === false) {
        likeDislikeArea = "";
    }

    let listName = <Box sx={{ flexGrow: 1, overflowX: 'auto', top: '6%', left: '3%', position: 'absolute', maxWidth: '52%' }} >{listInfo.name}</Box>;
    if (editActive) {
        listName = <TextField
            required
            id={"list-" + listInfo._id}
            label="Playlist Name"
            name="name"
            autoComplete="Playlist Name"
            className='list-card'
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            defaultValue={listInfo.name}
            inputProps={{ style: { fontSize: 18 } }}
            variant="filled"
            InputLabelProps={{ style: { fontSize: 16 } }}
            autoFocus
            sx={{ flexGrow: 1, overflowX: 'auto', top: '-15%', left: '0%', position: 'absolute', width: '80%' }}
        />
    }

    // FULL LIST CARD
    let cardElement =
        <ListItem
            sx={listItemStyle}
            id={listInfo._id}
            key={listInfo._id}

        >
            <Box //TOP
                sx={{ marginTop: '10px', display: 'flex', p: 1, paddingBottom: 0, paddingTop: 0 }}
                style={{ minHeight: '80px', height: '6%', width: '100%', fontSize: '20pt', position: 'relative' }}
                onClick={handleToggleEdit}
            >
                {listName}
                <Box sx={{ flexGrow: 1, overflowX: 'auto', top: '56%', left: '3%', position: 'absolute', fontSize: '15pt' }}>
                    By: <Typography display="inline" style={{ color: '#1310ec', textDecoration: 'underline', fontWeight: 'bold' }}> {' '} {listInfo.ownerUserName}</Typography> </Box>
                {likeDislikeArea}
            </Box>

            {cardCenter}

            {editToolbar}

            <Box //BOTTOM
                sx={{ display: 'flex', p: 1, paddingBottom: 0, paddingTop: 0 }}
                style={{ minHeight: '80px', height: '6%', width: '100%', fontSize: '15pt', position: 'relative' }}
                onClick={handleToggleEdit}
            >
                <Box sx={{ flexGrow: 1, overflowX: 'auto', bottom: '6%', left: '3%', position: 'absolute' }}> {publishText} {published}</Box>
                <Box sx={{ flexGrow: 1, overflowX: 'auto', bottom: '6%', left: '55%', position: 'absolute' }}>{listensText} {listens}</Box>
                <Box sx={{ bottom: '0%', right: '3%', position: 'absolute' }}>
                    {listOpenCloseButton}
                </Box>
            </Box>

            {modalJSX}
        </ListItem>

    return (
        cardElement
    );
}

export default ListCard;