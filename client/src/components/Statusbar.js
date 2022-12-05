import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { Typography } from '@mui/material'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text ="";
    let statusName = "statusbar-visible";
    let statusBarContent = "";
    if (store.currentList && store.currentHomeScreen !== "HOME") {
        text = store.currentList.name;
    }
    if (store.currentHomeScreen === "ALL_LISTS" && store.searchBar !== "" && store.searchBar) {
        statusBarContent=<Typography variant="h4">{store.searchBar} {' '} Playlists</Typography>;
    }
    if (store.currentHomeScreen === "USERS" && store.searchBar !== "" && store.searchBar) {
        statusBarContent=<Typography variant="h4">{store.searchBar} {' '} Lists</Typography>;
    }

    return (
        <div id="playlister-statusbar" className={statusName}>
            {statusBarContent}
        </div> 
    );
}

export default Statusbar;