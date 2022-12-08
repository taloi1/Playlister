import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import VideoArea from './VideoArea'
import Statusbar from './Statusbar'

import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ListIcon from '@mui/icons-material/List';
import { TextField } from '@mui/material'
import { Box } from '@mui/material'
import { IconButton } from '@mui/material'
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const [text, setText] = useState("");
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        store.loadListInfo();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    function handleChangeScreenHome() {
        store.setHomeScreenHome();
    }
    function handleChangeScreenAllLists() {
        store.setHomeScreenAllLists();
    }
    function handleChangeScreenUsers() {
        store.setHomeScreenUsers();
    }

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleChangeSortName() {
        handleMenuClose();
        store.setSortName();
    }
    function handleChangeSortPublishDate() {
        handleMenuClose();
        store.setSortPublishDate();
    }
    function handleChangeSortEditDate() {
        handleMenuClose();
        store.setSortEditDate();
    }
    function handleChangeSortListens() {
        handleMenuClose();
        store.setSortListens();
    }
    function handleChangeSortLikes() {
        handleMenuClose();
        store.setSortLikes();
    }
    function handleChangeSortDislikes() {
        handleMenuClose();
        store.setSortDislikes();
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.changeSearchBar(text);
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let nameStyle = { fontWeight: 'bold', backgroundColor: '#cccccc' };
    if (store.sortType !== "NAME") {
        nameStyle = { fontWeight: 'bold' };
    }
    let publishStyle = { fontWeight: 'bold' };
    if (store.sortType === "PUBLISH_DATE") {
        publishStyle = { fontWeight: 'bold', backgroundColor: '#cccccc' };
    }
    let editStyle = { fontWeight: 'bold' };
    if (store.sortType === "EDIT_DATE") {
        editStyle = { fontWeight: 'bold', backgroundColor: '#cccccc' };
    }
    let listensStyle = { fontWeight: 'bold' };
    if (store.sortType === "LISTENS") {
        listensStyle = { fontWeight: 'bold', backgroundColor: '#cccccc' };
    }
    let likesStyle = { fontWeight: 'bold' };
    if (store.sortType === "LIKES") {
        likesStyle = { fontWeight: 'bold', backgroundColor: '#cccccc' };
    }
    let dislikesStyle = { fontWeight: 'bold' };
    if (store.sortType === "DISLIKES") {
        dislikesStyle = { fontWeight: 'bold', backgroundColor: '#cccccc' };
    }


    const menuId = 'primary-search-sort-menu';
    const sortMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem style={nameStyle} onClick={handleChangeSortName}>Name (A - Z)</MenuItem>
            <MenuItem style={publishStyle} onClick={handleChangeSortPublishDate}>Publish Date (Newest)</MenuItem>
            <MenuItem style={editStyle} onClick={handleChangeSortEditDate}>Edit Date (Newest)</MenuItem>
            <MenuItem style={listensStyle} onClick={handleChangeSortListens}>Listens (High - Low)</MenuItem>
            <MenuItem style={likesStyle} onClick={handleChangeSortLikes}>Likes (High - Low)</MenuItem>
            <MenuItem style={dislikesStyle} onClick={handleChangeSortDislikes}>Dislikes (High - Low)</MenuItem>
        </Menu>

    let HomeScreenBar = "";
    if (store.currentHomeScreen === "HOME") {
        HomeScreenBar = <div id="list-selector-heading">
            <Box sx={{ p: 1 }}>
                <IconButton
                    onClick={handleCreateNewList}
                    aria-label='add'>
                    <AddIcon style={{ fontSize: '48pt' }} sx={{ color: 'ffffff' }} />
                </IconButton>
            </Box>
            <Typography variant="h2">Your Lists</Typography>
        </div>
    }

    let listCards = "";
    if (store) {
        listCards =
            <List sx={{ width: '96%', left: '2%' }}>
                {
                    store.listInfo.map((info) => (
                        <ListCard
                            key={info._id}
                            listInfo={info}
                            selected={false}
                        />
                    ))
                }
            </List>;
    }

    let homeButton = "";
    let homeButtonStyle = { fontSize: '30pt', color: '#555555' };
    if (store.currentHomeScreen === "HOME") {
        homeButtonStyle = { fontSize: '30pt', color: '#222222' };
    }
    if (auth.user) {
        homeButton = <IconButton
            onClick={handleChangeScreenHome}
            aria-label='add'>
            <HomeIcon style={homeButtonStyle} />
        </IconButton>;;
    }

    let listsButtonStyle = { fontSize: '30pt', color: '#555555' };
    if (store.currentHomeScreen === "ALL_LISTS") {
        listsButtonStyle = { fontSize: '30pt', color: '#222222' };
    }
    let usersButtonStyle = { fontSize: '30pt', color: '#555555' };
    if (store.currentHomeScreen === "USERS") {
        usersButtonStyle = { fontSize: '30pt', color: '#222222' };
    }
    
    return (
        <div id="playlist-selector">
            <div id="home-banner">
                <Box sx={{ pt: 1 }}>
                    {homeButton}
                    <IconButton
                        onClick={handleChangeScreenAllLists}
                        aria-label='add'>
                        <GroupsOutlinedIcon style={listsButtonStyle} />
                    </IconButton>
                    <IconButton
                        onClick={handleChangeScreenUsers}
                        aria-label='add'>
                        <PersonOutlineIcon style={usersButtonStyle}/>
                    </IconButton>
                </Box>

                <TextField
                    label={'Search'}
                    style={{ width: '55%', marginLeft: '7%', marginTop: '5px', backgroundColor: '#ffffff', borderRadius: '4px' }}
                    onKeyPress={handleKeyPress}
                    onChange={handleUpdateText}
                    >
                </TextField>

                <Box sx={{ pt: 1, pl: 1 }} style={{ right: '2%', position: 'absolute', fontWeight: 'bold', fontSize: 25, }}>
                    SORT BY
                    <IconButton
                        onClick={handleSortMenuOpen}
                        aria-label='add'
                        aria-controls={menuId} >
                        <ListIcon style={{ fontSize: '30pt' }} sx={{ color: 'ffffff' }} />
                    </IconButton>
                </Box>
            </div>
            <div id="list-selector-list">
                {
                    listCards
                }
                <MUIDeleteModal />
            </div>
            <div>
                <VideoArea />
            </div>
            <Statusbar />
            {HomeScreenBar}
            {sortMenu}
        </div>)
}

export default HomeScreen;