import React, { useContext} from 'react'
import { GlobalStoreContext } from '../store'
import YouTubePlayer from './YoutubePlayer';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const VideoArea = () => {
    const { store } = useContext(GlobalStoreContext);

   

    return (
        <div>
            PLAYLIST AREA
            <YouTubePlayer/>
        </div>)
}

export default VideoArea;