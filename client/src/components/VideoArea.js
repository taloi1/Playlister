import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const VideoArea = () => {
    const { store } = useContext(GlobalStoreContext);

   

    return (
        <div>
            PLAYLIST AREA
        </div>)
}

export default VideoArea;