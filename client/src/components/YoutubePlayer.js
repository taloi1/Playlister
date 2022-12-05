import { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'
import React from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

export default function YouTubePlayer() {
    const { store } = useContext(GlobalStoreContext);
    const [listData, setListData] = useState({name: "", songNum: "", title: "", artist: ""});
    const [player, setPlayer] = useState(null);
    const [currentSong, setCurrentSong] = useState(0);
    const [currentList, setCurrentList] = useState(null);
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    if (currentList !== store.currentList) {
        let asyncChangeList = async function () {
            let list = store.currentList
            setCurrentList(list);
        }
        asyncChangeList();
        setCurrentSong(0);
        console.log("?????????????????????????????????????????????? ?????????????????????????????");
        console.log(currentList);
    }

    let playlist = null;
    if (currentList) {
        if (currentList.songs.length !== 0) {
            playlist = currentList.songs.map(song => song.youTubeId);
            console.log(playlist);
        }
    }

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST

    const playerOptions = {
        height: '390',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
        setListData({
            name: currentList.name,
            songNum: currentSong+1,
            title: currentList.songs[currentSong].title,
            artist: currentList.songs[currentSong].artist
        })
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        setCurrentSong(currentSong + 1);
        if (currentSong >= (playlist.length - 1)) {
            setCurrentSong(0);
        }
    }

    function decSong() {
        setCurrentSong(currentSong - 1);
        console.log(currentSong);
        if (currentSong <= 0) {
            setCurrentSong(playlist.length - 1);
        }
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        setPlayer(event.target);
        playerStateChange(playerStatus)
    }

    function playerStateChange(playerStatus) {
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    function handleBack () {
        decSong();
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
        setListData({
            name: currentList.name,
            songNum: currentSong+1,
            title: currentList.songs[currentSong].title,
            artist: currentList.songs[currentSong].artist
        })
    }
    function handlePause () {
        player.pauseVideo();
    }
    function handlePlay () {
        player.playVideo();
    }
    function handleForward () {
        playerStateChange(0);
    }

    let songInfo = <Box style={{left:'5%', position:'absolute'}}> 
        <Typography style={{fontWeight:'bold'}}>Playlist: {' '} {listData.name}</Typography> 
        <Typography style={{fontWeight:'bold'}}>Song #: {' '} {listData.songNum}</Typography> 
        <Typography style={{fontWeight:'bold'}}>Title: {' '} {listData.title}</Typography> 
        <Typography style={{fontWeight:'bold'}}>Artist: {' '} {listData.artist}</Typography> 
    </Box>

    if (playlist !== null) {
        return <div>
            <YouTube
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange} />
        
            {songInfo}

            <Box sx={{position: 'absolute', bottom: '0%', left: '0%', justifyContent: 'center', display: 'flex', width:'100%', height: 'auto'}}>
                    <IconButton 
                    onClick={handleBack} 
                    aria-label='back'>
                        <FastRewindIcon style={{fontSize:'26pt', flex: 'none'}} sx={{color:'ffffff'}} />
                    </IconButton>
                    <IconButton 
                    onClick={handlePause} 
                    aria-label='pause'>
                        <StopIcon style={{fontSize:'26pt', flex: 'none'}} sx={{color:'ffffff'}} />
                    </IconButton>
                    <IconButton 
                    onClick={handlePlay} 
                    aria-label='play'>
                        <PlayArrowIcon style={{fontSize:'26pt', flex: 'none'}} sx={{color:'ffffff'}} />
                    </IconButton>
                    <IconButton 
                    onClick={handleForward} 
                    aria-label='forward'>
                        <FastForwardIcon style={{fontSize:'26pt', flex: 'none'}} sx={{color:'ffffff'}} />
                    </IconButton>
                </Box>
        </div>;
    } else {
        return "";
    }
}