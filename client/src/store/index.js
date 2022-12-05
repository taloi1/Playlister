import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
import HomeScreen from '../components/HomeScreen'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LIST_INFO: "LOAD_LIST_INFO",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CHANGE_SCREEN: "CHANGE_SCREEN",
    CHANGE_SORT_TYPE: "CHANGE_SORT_TYPE",
    PUBLISH_LIST: "PUBLISH_LIST",
    CHANGE_SEARCH_BAR: "CHANGE_SEARCH_BAR",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG"
}

const CurrentHomeScreen = {
    SPLASH_SCREEN: "SPLASH_SCREEN",
    HOME: "HOME",
    ALL_LISTS: "ALL_LISTS",
    USERS: "USERS"
}

const SortType = {
    NAME: "NAME",
    PUBLISH_DATE: "PUBLISH_DATE",
    EDIT_DATE: "EDIT_DATE",
    LISTENS: "LISTENS",
    LIKES: "LIKES",
    DISLIKES: "DISLIKES"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {

    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        currentHomeScreen: CurrentHomeScreen.SPLASH_SCREEN,
        sortType: SortType.LISTENS,
        listInfo: [],
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        searchBar: null,
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log("STATE UPDATE");
        console.log(type);
        console.log(payload);
        console.log(store);
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: payload.listInfo,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: CurrentHomeScreen.HOME,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LIST_INFO: {
                return setStore({
                    currentModal: store.currentModal,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.SortType,
                    listInfo: payload,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    searchBar: store.searchBar,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.DELETE_LIST,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    searchBar: store.searchBar,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal: CurrentModal.EDIT_SONG,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal: CurrentModal.REMOVE_SONG,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: store.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            case GlobalStoreActionType.CHANGE_SCREEN: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: payload.screen,
                    sortType: SortType.LISTENS,
                    listInfo: payload.listData,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: null,
                });
            }
            case GlobalStoreActionType.CHANGE_SORT_TYPE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: payload,
                    listInfo: store.listInfo,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            case GlobalStoreActionType.PUBLISH_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: payload.listInfo,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                });
            }
            case GlobalStoreActionType.CHANGE_SEARCH_BAR: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: payload.listInfo,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: payload.search,
                });
            }
            default:
                return store;
        }
    }

    // RETURNS LIST INFO FROM BACKEND AT ANY TIME
    store.loadListInfo = function () {
        async function asyncLoadListInfo() {
            if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                const response = await api.getPlaylistPairs(store.searchBar, store.currentHomeScreen, store.sortType);

                if (response.data.success) {
                    let infoArray = response.data.listInfo;

                    if (store.sortType === SortType.NAME) {
                        infoArray.sort((a, b) => {
                            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }

                            // names must be equal
                            return 0;
                        });
                        console.log("NAME SORT");
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.PUBLISH_DATE) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.EDIT_DATE) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LISTENS) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LIKES) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.DISLIKES) {
                        console.log(infoArray);
                    }

                    storeReducer({
                        type: GlobalStoreActionType.LOAD_LIST_INFO,
                        payload: infoArray
                    });

                } else {
                    console.log("API FAILED TO GET THE LIST INFO");
                }

            }
            else {
                let response = await api.getPublishedPlaylists(store.searchBar, store.currentHomeScreen, store.sortType);

                if (response.data.success) {
                    let infoArray = response.data.data;

                    if (store.sortType === SortType.NAME) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.PUBLISH_DATE) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LISTENS) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LIKES) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.DISLIKES) {
                        console.log(infoArray);
                    }

                    storeReducer({
                        type: GlobalStoreActionType.LOAD_LIST_INFO,
                        payload: infoArray
                    });

                } else {
                    console.log("API FAILED TO GET THE LIST INFO");
                }
            }
        }
        asyncLoadListInfo();
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs(store.searchBar, store.currentHomeScreen, store.sortType);
                            if (response.data.success) {
                                let pairsArray = response.data.listInfo;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        listInfo: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.publishList = function (id) {
        async function asyncPublishList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.isPublished === false) {
                    playlist.isPublished = true;
                    playlist.publishDate = new Date();

                    async function updateList(playlist) {
                        response = await api.updatePlaylistById(playlist._id, playlist);
                        if (response.data.success) {
                            async function getListPairs(playlist) {
                                response = await api.getPlaylistPairs(store.searchBar, store.currentHomeScreen, store.sortType);
                                if (response.data.success) {
                                    let playlists = response.data.listInfo;

                                    storeReducer({
                                        type: GlobalStoreActionType.PUBLISH_LIST,
                                        payload: {
                                            listInfo: playlists,
                                            playlist: playlist
                                        }
                                    });
                                }
                            }
                            getListPairs(playlist);
                        }
                    }
                    updateList(playlist);
                }

            }
        }
        asyncPublishList(id)
    }

    store.changeSearchBar = function (text) {
        async function asyncChangeSearchBar(text) {
            if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                const response = await api.getPlaylistPairs(text, store.currentHomeScreen, store.sortType);
                if (response.data.success) {
                    let infoArray = response.data.listInfo;

                    if (store.sortType === SortType.NAME) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.PUBLISH_DATE) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LISTENS) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LIKES) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.DISLIKES) {
                        console.log(infoArray);
                    }


                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SEARCH_BAR,
                        payload: { search: text, listInfo: infoArray }
                    });
                }

            } else {
                let response = await api.getPublishedPlaylists(text, store.currentHomeScreen, store.sortType);
                if (response.data.success) {
                    let infoArray = response.data.data;

                    if (store.sortType === SortType.NAME) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.PUBLISH_DATE) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LISTENS) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.LIKES) {
                        console.log(infoArray);
                    }
                    if (store.sortType === SortType.DISLIKES) {
                        console.log(infoArray);
                    }


                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SEARCH_BAR,
                        payload: { search: text, listInfo: infoArray }
                    });
                }
            }
        }
        asyncChangeSearchBar(text);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, auth.user.email, auth.user.userName, 0, 0, 0, false, [], []);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: { playlist: newList }
            }
            );
            store.loadListInfo();
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.duplicateList = async function (id) {
        let getResponse = await api.getPlaylistById(id);
        if (getResponse.data.success) {
            const response = await api.createPlaylist(store.currentList.name, auth.user.email, auth.user.userName, 0, 0, 0, false, [], store.currentList.songs);
            if (response.status === 201) {
                tps.clearAllTransactions();
                let newList = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: { playlist: newList }
                }
                );
                store.setHomeScreenHome();
                store.loadListInfo();
            }
            else {
                console.log("API FAILED TO DUPLICATE LIST");
            }
        }

    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id: id, playlist: playlist }
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadListInfo();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function () {
        store.deleteList(store.listIdMarkedForDeletion);
        store.loadListInfo();
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToEdit }
        });
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToRemove }
        });
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    //history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.addListen = function (id) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        console.log(id);
        async function asyncaddListen(id) {
            console.log("BBBBBBBBBBBBBBBBBBBBB");
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                console.log("CCCCCCCCCCCCCCCCC");
                let playlist = response.data.playlist;
                playlist.listens++;
                response = await api.updatePlaylistById(id, playlist);
                if (response.data.success) {
                    //store.loadListInfo();
                }
            }
        }
        asyncaddListen(id);
    }

    store.getPlaylist = function (id) {
        async function asyncGetPlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                console.log(response.data.playlist);
                return response.data.playlist;
            }
        }
        asyncGetPlaylist(id);
    }
    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }
    store.addNewSong = function () {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function (index, song) {
        let list = store.currentList;
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function (start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function (index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);
        tps.addTransaction(transaction);
    }
    store.addComment = function (content) {
        let list = store.currentList;
        console.log(list);
        list.comments.push({
            userName: auth.user.userName,
            content: content
        });
        store.updateCurrentList();
    }
    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.undoTransaction();
    }
    store.redo = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.doTransaction();
    }
    store.clearAllTransactions = function () {
        if (store.currentModal === CurrentModal.NONE)
            tps.clearAllTransactions();
    }
    store.canAddNewSong = function () {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }
    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo() && store.currentModal === CurrentModal.NONE);
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToRedo() && store.currentModal === CurrentModal.NONE);
    }
    store.canClose = function () {
        return ((store.currentList !== null) && store.currentModal === CurrentModal.NONE);
    }

    store.setHomeScreenHome = function () {
        async function asyncSetHomeScreenHome() {
            let response = await api.getPlaylistPairs("", CurrentHomeScreen.HOME, store.sortType);
            if (response.data.success) {
                console.log(response.data);
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_SCREEN,
                    payload: { screen: CurrentHomeScreen.HOME, listData: response.data.listInfo }
                });
            }
        }
        asyncSetHomeScreenHome();
    }
    store.setHomeScreenAllLists = function () {
        async function asyncSetHomeScreenAllLists() {
            let response = await api.getPublishedPlaylists("", CurrentHomeScreen.ALL_LISTS, store.sortType);
            if (response.data.success) {
                console.log(response.data);
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_SCREEN,
                    payload: { screen: CurrentHomeScreen.ALL_LISTS, listData: response.data.data }
                });
            }
        }
        asyncSetHomeScreenAllLists();
    }
    store.setHomeScreenUsers = function () {
        async function asyncSetHomeScreenUsers() {
            let response = await api.getPublishedPlaylists("", CurrentHomeScreen.USERS, store.sortType);
            if (response.data.success) {
                console.log(response.data);
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_SCREEN,
                    payload: { screen: CurrentHomeScreen.USERS, listData: response.data.data }
                });
            }
        }
        asyncSetHomeScreenUsers();
    }

    store.setSortName = function () {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_TYPE,
            payload: SortType.NAME
        });
    }
    store.setSortPublishDate = function () {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_TYPE,
            payload: SortType.PUBLISH_DATE
        });
    }
    store.setSortListens = function () {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_TYPE,
            payload: SortType.LISTENS
        });
    }
    store.setSortLikes = function () {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_TYPE,
            payload: SortType.LIKES
        });
    }
    store.setSortDislikes = function () {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_TYPE,
            payload: SortType.DISLIKES
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };