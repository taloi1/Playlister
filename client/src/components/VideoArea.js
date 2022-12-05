import React, { useState, useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import YouTubePlayer from './YoutubePlayer';
import List from '@mui/material/List';
import { ListItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import CommentCard from './CommentCard';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const VideoArea = () => {
    const { store } = useContext(GlobalStoreContext);
    const [commentsEnabled, setCommentsEnabled] = useState(false);
    const [text, setText] = useState("");


    function handleChangeComments() {
        setCommentsEnabled(true);
    }

    function handleChangePlayer() {
        setCommentsEnabled(false);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter" && text !== "") {
            store.addComment(text)
            setText("");
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let videoAreaContent = <Box style={{ p: 0, width: '95%', height: '90%', position: 'relative', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: 'ffff41', backgroundColor: '#d4d4f5' }}>
        <YouTubePlayer />
    </Box>;
    let commentsArea = "";
    if (commentsEnabled && store.currentList) {
        if (store.currentList.isPublished) {
            commentsArea =
            <Box style={{ p: 0, width: '95%', height: '90%', position: 'absolute', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: 'ffff41', backgroundColor: '#d4d4f5' }}>
                <List style={{ position: 'absolute', width: '100%', height: '95%', top: '0%' }}>
                    <List style={{ position: 'absolute', width: '96%', height: '80%', top: '2%', left: '2%', overflowY: "auto", }}>
                        {
                            store.currentList.comments.map((comment) => (
                                <CommentCard comment={comment}></CommentCard>
                            ))
                        }
                    </List>
                    <TextField
                        label={'Add Comment'}
                        style={{ width: '96%', marginLeft: '2%', backgroundColor: '#ffffff', borderRadius: '4px', position: 'absolute', bottom: '0%' }}
                        onKeyPress={handleKeyPress}
                        onChange={handleUpdateText}
                        value={text}>
                    </TextField>
                </List>
            </Box>
        }
        if (!store.currentList.isPublished) {
            commentsArea =
            <Box style={{ p: 0, width: '95%', height: '90%', position: 'absolute', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: 'ffff41', backgroundColor: '#d4d4f5' }}>
                
            </Box>
        }
    }

    return (
        <Box style={{
            position: 'absolute', left: '61%', top: '15%', width: '38%', height: '70%',
            display: 'flex', marginTop: '2%', flexDirection: 'column', boxSizing: 'border-box', p: 0
        }}>
            <Button
                id='close-button'
                style={{ position: 'absolute', width: '30%', height: '8%', bottom: '92%' }}
                onClick={handleChangePlayer}
                variant="contained">
                Player
            </Button>
            <Button
                id='close-button'
                style={{ position: 'absolute', width: '30%', height: '8%', bottom: '92%', left: '30%' }}
                onClick={handleChangeComments}
                variant="contained">
                Comments
            </Button>
            {videoAreaContent}
            {commentsArea}

        </Box>)
}

export default VideoArea;