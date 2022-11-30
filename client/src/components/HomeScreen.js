import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import VideoArea from './VideoArea'
import Statusbar from './Statusbar'

import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ListIcon from '@mui/icons-material/List';
import {TextField} from '@mui/material'
import { Box } from '@mui/material'
import {IconButton} from '@mui/material'
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
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        store.loadIdNamePairs();
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
        store.closeCurrentList();
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
        <MenuItem style={{fontWeight:'bold'}} onClick={handleChangeSortName}>Name (A - Z)</MenuItem>
        <MenuItem style={{fontWeight:'bold'}} onClick={handleChangeSortPublishDate}>Publish Date (Newest)</MenuItem>
        <MenuItem style={{fontWeight:'bold'}} onClick={handleChangeSortListens}>Listens (High - Low)</MenuItem>
        <MenuItem style={{fontWeight:'bold'}} onClick={handleChangeSortLikes}>Likes (High - Low)</MenuItem>
        <MenuItem style={{fontWeight:'bold'}} onClick={handleChangeSortDislikes}>Dislikes (High - Low)</MenuItem>
    </Menu>        

    let HomeScreenBar = "";
    if (store.currentHomeScreen === "HOME") {
        HomeScreenBar = <div id="list-selector-heading">
                <Box sx={{ p: 1 }}>
                    <IconButton 
                    onClick={handleCreateNewList} 
                    aria-label='add'>
                        <AddIcon style={{fontSize:'48pt'}} sx={{color:'ffffff'}} />
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
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    return (
        <div id="playlist-selector">
            <div id="home-banner">
                <Box sx={{ pt: 1}}>
                    <IconButton 
                    onClick={handleChangeScreenHome} 
                    aria-label='add'>
                        <HomeIcon style={{fontSize:'30pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                    <IconButton 
                    onClick={handleChangeScreenAllLists} 
                    aria-label='add'>
                        <GroupsOutlinedIcon style={{fontSize:'30pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                    <IconButton 
                    onClick={handleChangeScreenUsers} 
                    aria-label='add'>
                        <PersonOutlineIcon style={{fontSize:'30pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                </Box>

                <TextField  
                    label={'Search'}  style={{ width:'55%', marginLeft:'7%', marginTop:'5px', backgroundColor: '#ffffff', borderRadius: '4px'}}> 
                </TextField>

                <Box sx={{ pt: 1, pl:1 }} style={{right:'2%', position: 'absolute', fontWeight: 'bold', fontSize: 25, fontStyle: 'oblique'}}>
                    SORT BY
                    <IconButton 
                    onClick={handleSortMenuOpen} 
                    aria-label='add'
                    aria-controls={menuId} >
                        <ListIcon style={{fontSize:'30pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                </Box>
            </div>
            <div id="list-selector-list">
                {
                    listCards
                }
                <MUIDeleteModal />
            </div>
            <div id="video-area">
                <VideoArea/>
            </div>
            <Statusbar />   
            {HomeScreenBar} 
            {sortMenu}
        </div>)
}

export default HomeScreen;