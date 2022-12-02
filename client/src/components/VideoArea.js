import React, { useState, useContext} from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import YouTubePlayer from './YoutubePlayer';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const VideoArea = () => {
    const { store } = useContext(GlobalStoreContext);
    const [commentsEnabled, setCommentsEnabled] = useState(false);


    function handleChangeComments () {
        setCommentsEnabled(true);
    }

    function handleChangePlayer () {
        setCommentsEnabled(false);
    }

    let videoAreaContent = "";
    if (commentsEnabled) {
        videoAreaContent = "COMMENTS"
    } else {
        videoAreaContent = <YouTubePlayer/>
    }

    return (
        <Box style={{position: 'absolute', left: '61%', top: '15%', width: '38%', height: '70%', 
        display: 'flex', marginTop: '2%', flexDirection: 'column', boxSizing: 'border-box', p: 0}}>
            <Button 
                id='close-button'
                style={{position: 'absolute', width: '30%', height: '8%', bottom: '92%'}}
                onClick={handleChangePlayer}
                variant="contained">
                    Player
            </Button>
            <Button 
                id='close-button'
                style={{position: 'absolute', width: '30%', height: '8%', bottom: '92%', left: '30%'}}
                onClick={handleChangeComments}
                variant="contained">
                    Comments
            </Button>
            <Box style={{p: 0, width: '95%', height:'90%', position: 'relative', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: 'ffff41', backgroundColor: '#d4d4f5'}}>
                {videoAreaContent}
            </Box>

        </Box>)
}

export default VideoArea;