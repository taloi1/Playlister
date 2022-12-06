import React, { useState, useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import YouTubePlayer from './YoutubePlayer';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import CommentCard from './CommentCard';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const VideoArea = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
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


    let videoAreaContent = <Box style={{ p: 0, width: '95%', height: '90%', position: 'relative', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: '#111111', backgroundColor: '#d4d4f5' }}>
        <YouTubePlayer />
    </Box>;
    if (!store.playingList) {
        videoAreaContent = <Box style={{ p: 0, width: '95%', height: '90%', position: 'relative', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: '#111111', backgroundColor: '#d4d4f5' }}></Box>;
    }
    let commentsArea = "";
    let commentTextField = "";
    if (auth.user) {
        commentTextField =<TextField
            label={'Add Comment'}
            style={{ width: '96%', marginLeft: '2%', backgroundColor: '#ffffff', borderRadius: '4px', position: 'absolute', bottom: '0%' }}
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            value={text}>
        </TextField>
    }
    if (commentsEnabled && store.playingList) {
        if (store.playingList.isPublished) {
            commentsArea =
                <Box style={{ p: 0, width: '95%', height: '90%', position: 'absolute', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: 'ffff41', backgroundColor: '#d4d4f5' }}>
                    <List style={{ position: 'absolute', width: '100%', height: '95%', top: '0%' }}>
                        <List style={{ position: 'absolute', width: '96%', height: '80%', top: '2%', left: '2%', overflowY: "auto", }}>
                            {
                                store.playingList.comments.map((comment) => (
                                    <CommentCard comment={comment}></CommentCard>
                                ))
                            }
                        </List>
                        {commentTextField}
                    </List>
                </Box>
        }
        if (!store.playingList.isPublished) {
            commentsArea =
                <Box style={{ p: 0, width: '95%', height: '90%', position: 'absolute', top: '8%', borderWidth: '3px', borderRadius: '10px', borderStyle: 'solid', borderColor: 'ffff41', backgroundColor: '#d4d4f5' }}>

                </Box>
        }
    }

    let playerButtonStyle = { position: 'absolute', width: '25%', height: '8%', bottom: '92%', backgroundColor: '#ffffff', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111' };
    if (commentsEnabled) {
        playerButtonStyle = { position: 'absolute', width: '25%', height: '8%', bottom: '92%', backgroundColor: '#cccccc', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111' };
    }
    let commentsButtonStyle = { position: 'absolute', width: '25%', height: '8%', bottom: '92%', left: '25%', backgroundColor: '#ffffff', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111' };
    if (!commentsEnabled) {
        commentsButtonStyle = { position: 'absolute', width: '25%', height: '8%', bottom: '92%', left: '25%', backgroundColor: '#cccccc', color: '#111111', fontWeight: 'bold', borderWidth: '2px', borderStyle: 'solid', borderColor: '#111111' };
    }

    return (
        <Box style={{
            position: 'absolute', left: '61%', top: '15%', width: '38%', height: '70%',
            display: 'flex', marginTop: '2%', flexDirection: 'column', boxSizing: 'border-box', p: 0
        }}>
            <Button
                id='close-button'
                style={playerButtonStyle}
                onClick={handleChangePlayer}
                variant="contained">
                Player
            </Button>
            <Button
                id='close-button'
                style={commentsButtonStyle}
                onClick={handleChangeComments}
                variant="contained">
                Comments
            </Button>
            {videoAreaContent}
            {commentsArea}

        </Box>)
}

export default VideoArea;