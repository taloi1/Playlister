import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import VideoArea from './VideoArea'
import Statusbar from './Statusbar'

import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {InputLabel} from '@mui/material'
import {InputAdornment} from '@mui/material'
import {TextField} from '@mui/material'
import { Box } from '@mui/material'
import {IconButton} from '@mui/material'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
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
                    onClick={handleCreateNewList} 
                    aria-label='add'>
                        <HomeIcon style={{fontSize:'30pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                </Box>

                <Box sx={{ pt: 1, pl:1 }}>
                    <IconButton 
                    onClick={handleCreateNewList} 
                    aria-label='add'>
                        <GroupsOutlinedIcon style={{fontSize:'30pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                </Box>

                <Box sx={{ pt: 1, pl:1 }}>
                    <IconButton 
                    onClick={handleCreateNewList} 
                    aria-label='add'>
                        <PersonOutlineIcon style={{fontSize:'30pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                </Box>

                <TextField  
                    label={'Search'}  style={{ width:'55%', marginLeft:'7%', marginTop:'5px', backgroundColor: '#ffffff', borderRadius: '4px'}}> 
                </TextField>
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
            <div id="list-selector-heading">
                <Box sx={{ p: 1 }}>
                    <IconButton 
                    onClick={handleCreateNewList} 
                    aria-label='add'>
                        <AddIcon style={{fontSize:'48pt'}} sx={{color:'ffffff'}} />
                    </IconButton>
                </Box>
                <Typography variant="h2">Your Lists</Typography>
            </div>    
        </div>)
}

export default HomeScreen;