import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
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
    VIEW_AS_GUEST: "VIEW_AS_GUEST",
    SET_PLAYING_LIST: "SET_PLAYING_LIST",
    LIKE_DISLIKE: "LIKE_DISLIKE",
    PLAY_SONG: "PLAY_SONG",
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
        currentHomeScreen: CurrentHomeScreen.HOME,
        sortType: SortType.NAME,
        listInfo: [],
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        searchBar: null,
        guest: false,
        playingList: null,
        playingSong: 0,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LIST_INFO: {
                return setStore({
                    currentModal: store.currentModal,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: payload,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
                });
            }
            case GlobalStoreActionType.CHANGE_SCREEN: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: payload.screen,
                    sortType: SortType.NAME,
                    listInfo: payload.listData,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: null,
                    guest: store.guest,
                    playingList: null,
                    playingSong: 0,
                });
            }
            case GlobalStoreActionType.CHANGE_SORT_TYPE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: payload.type,
                    listInfo: payload.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: null,
                    playingSong: store.playingSong,
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
                    guest: store.guest,
                    playingList: null,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.VIEW_AS_GUEST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: payload.screen,
                    sortType: store.sortType,
                    listInfo: payload.listInfo,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: null,
                    guest: payload.guest,
                    playingList: null,
                    playingSong: null,
                });
            }
            case GlobalStoreActionType.SET_PLAYING_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: payload.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                    guest: store.guest,
                    playingList: payload.list,
                    playingSong: 0,
                });
            }
            case GlobalStoreActionType.LIKE_DISLIKE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: payload.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: store.playingSong,
                });
            }
            case GlobalStoreActionType.PLAY_SONG: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    currentHomeScreen: store.currentHomeScreen,
                    sortType: store.sortType,
                    listInfo: payload.listInfo,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBar: store.searchBar,
                    guest: store.guest,
                    playingList: store.playingList,
                    playingSong: payload.playingSong,
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
                const response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, store.sortType);
                if (response.data.success) {
                    let infoArray = response.data.listInfo;
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
                store.listInfo.forEach(list => {
                    if (list.name === newName && list._id !== playlist._id) {
                        newName += " (1)";
                    }
                })
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListInfo(playlist) {
                            response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, store.sortType);
                            if (response.data.success) {
                                let infoArray = response.data.listInfo;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        listInfo: infoArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListInfo(playlist);
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
                            async function getListInfo(playlist) {
                                response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, store.sortType);
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
                            getListInfo(playlist);
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
                const response = await api.getUserPlaylistInfo(text, store.currentHomeScreen, store.sortType);
                if (response.data.success) {
                    let infoArray = response.data.listInfo;
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SEARCH_BAR,
                        payload: { search: text, listInfo: infoArray }
                    });
                }
            } else {
                let response = await api.getPublishedPlaylists(text, store.currentHomeScreen, store.sortType);
                if (response.data.success) {
                    let infoArray = response.data.data;
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
        let newListName = "Untitled";
        store.listInfo.forEach(list => {
            if (list.name === newListName) {
                newListName += " (1)";
            }
        });
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
            let newName = store.currentList.name;
            if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                store.listInfo.forEach(list => {
                    if (list.name === newName) {
                        newName += " (1)";
                    }
                });
            }

            const response = await api.createPlaylist(newName, auth.user.email, auth.user.userName, 0, 0, 0, false, [], store.currentList.songs);
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

    store.setPlayingList = function (id) {
        async function asyncSetPlayingList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.listens += 1;
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                        const response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, store.sortType);
                        if (response.data.success) {
                            let infoArray = response.data.listInfo;
                            storeReducer({
                                type: GlobalStoreActionType.SET_PLAYING_LIST,
                                payload: { list: playlist, listInfo: infoArray }
                            });
                        }
                    } else {
                        let response = await api.getPublishedPlaylists(store.searchBar, store.currentHomeScreen, store.sortType);
                        if (response.data.success) {
                            let infoArray = response.data.data;
                            storeReducer({
                                type: GlobalStoreActionType.SET_PLAYING_LIST,
                                payload: { list: playlist, listInfo: infoArray }
                            });
                        }
                    }

                    //history.push("/playlist/" + playlist._id);
                }
            }
        }
        if (store.playingList === null || !store.playingList) {
            asyncSetPlayingList(id);
        }
        if (store.playingList) {
            if (id !== store.playingList._id) {
                asyncSetPlayingList(id);
            }
        }

    }

    store.setPlayingSong = function (index) {
        async function asyncSetPlayingSong(index) {
            if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                const response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, store.sortType);
                if (response.data.success) {
                    let infoArray = response.data.listInfo;
                    storeReducer({
                        type: GlobalStoreActionType.PLAY_SONG,
                        payload: { playingSong: index, listInfo: infoArray }
                    });
                }
            } else {
                const response = await api.getPublishedPlaylists(store.searchBar, store.currentHomeScreen, store.sortType);
                if (response.data.success) {
                    let infoArray = response.data.data;
                    storeReducer({
                        type: GlobalStoreActionType.PLAY_SONG,
                        payload: { playingSong: index, listInfo: infoArray }
                    });
                }
            }

            //history.push("/playlist/" + playlist._id);
        }
        asyncSetPlayingSong(index);
    }

    store.likePlaylist = function (id) {
        async function asyncLike(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.likedUsers) {
                    const index = playlist.likedUsers.indexOf(auth.user.userName);
                    if (index > -1) {
                        playlist.likedUsers.splice(index, 1);
                        playlist.likes = playlist.likedUsers.length;
                    } else {
                        playlist.likedUsers.push(auth.user.userName);
                        playlist.likes = playlist.likedUsers.length;
                    }
                } else {
                    playlist.likedUsers.push(auth.user.userName);
                    playlist.likes = playlist.likedUsers.length;
                }
                if (playlist.dislikedUsers) {
                    const index = playlist.dislikedUsers.indexOf(auth.user.userName);
                    if (index > -1) {
                        playlist.dislikedUsers.splice(index, 1);
                        playlist.dislikes = playlist.dislikedUsers.length;
                    }
                }
                response = await api.updatePlaylistById(id, playlist);
                if (response.data.success) {
                    if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                        const response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, store.sortType);
                        if (response.data.success) {
                            let infoArray = response.data.listInfo;
                            storeReducer({
                                type: GlobalStoreActionType.SET_PLAYING_LIST,
                                payload: { listInfo: infoArray }
                            });
                        }
                    } else {
                        let response = await api.getPublishedPlaylists(store.searchBar, store.currentHomeScreen, store.sortType);
                        if (response.data.success) {
                            let infoArray = response.data.data;
                            storeReducer({
                                type: GlobalStoreActionType.SET_PLAYING_LIST,
                                payload: { listInfo: infoArray }
                            });
                        }
                    }
                }
            }
        }
        asyncLike(id);
    }

    store.dislikePlaylist = function (id) {
        async function asyncDislike(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (playlist.dislikedUsers) {
                    const index = playlist.dislikedUsers.indexOf(auth.user.userName)
                    if (index > -1) {
                        playlist.dislikedUsers.splice(index, 1)
                        playlist.dislikes = playlist.dislikedUsers.length;
                    } else {
                        playlist.dislikedUsers.push(auth.user.userName);
                        playlist.dislikes = playlist.dislikedUsers.length;
                    }
                } else {
                    playlist.dislikedUsers.push(auth.user.userName);
                    playlist.dislikes = playlist.dislikedUsers.length;
                }
                if (playlist.likedUsers) {
                    const index = playlist.likedUsers.indexOf(auth.user.userName);
                    if (index > -1) {
                        playlist.likedUsers.splice(index, 1);
                        playlist.likes = playlist.likedUsers.length;
                    }
                }
                response = await api.updatePlaylistById(id, playlist);
                if (response.data.success) {
                    if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                        const response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, store.sortType);
                        if (response.data.success) {
                            let infoArray = response.data.listInfo;
                            storeReducer({
                                type: GlobalStoreActionType.SET_PLAYING_LIST,
                                payload: { listInfo: infoArray }
                            });
                        }
                    } else {
                        let response = await api.getPublishedPlaylists(store.searchBar, store.currentHomeScreen, store.sortType);
                        if (response.data.success) {
                            let infoArray = response.data.data;
                            storeReducer({
                                type: GlobalStoreActionType.SET_PLAYING_LIST,
                                payload: { listInfo: infoArray }
                            });
                        }
                    }
                }
            }
        }
        asyncDislike(id);
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
        async function asyncUpdatePlayingList() {
            let list = store.playingList;
            console.log(list);
            list.comments.push({
                userName: auth.user.userName,
                content: content
            });
            const response = await api.updatePlaylistById(store.playingList._id, store.playingList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYING_LIST,
                    payload: { list: store.playingList, listInfo: store.listInfo }
                });
            }
        }
        asyncUpdatePlayingList();
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
            let response = await api.getUserPlaylistInfo("", CurrentHomeScreen.HOME, SortType.NAME);
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
            let response = await api.getPublishedPlaylists("", CurrentHomeScreen.ALL_LISTS, SortType.NAME);
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
            let response = await api.getPublishedPlaylists("", CurrentHomeScreen.USERS, SortType.NAME);
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
        store.setSortType(SortType.NAME);
    }
    store.setSortPublishDate = function () {
        store.setSortType(SortType.PUBLISH_DATE);
    }
    store.setSortEditDate = function () {
        store.setSortType(SortType.EDIT_DATE);
    }
    store.setSortListens = function () {
        store.setSortType(SortType.LISTENS);
    }
    store.setSortLikes = function () {
        store.setSortType(SortType.LIKES);
    }
    store.setSortDislikes = function () {
        store.setSortType(SortType.DISLIKES);
    }
    store.setSortType = function (type) {
        async function asyncSetSortType(type) {
            if (store.currentHomeScreen === CurrentHomeScreen.HOME) {
                const response = await api.getUserPlaylistInfo(store.searchBar, store.currentHomeScreen, type);
                if (response.data.success) {
                    let infoArray = response.data.listInfo;
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SORT_TYPE,
                        payload: { type: type, listInfo: infoArray }
                    });
                }
            } else {
                let response = await api.getPublishedPlaylists(store.searchBar, store.currentHomeScreen, type);
                if (response.data.success) {
                    let infoArray = response.data.data;
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SORT_TYPE,
                        payload: { type: type, listInfo: infoArray }
                    });
                }
            }
        }
        asyncSetSortType(type);
    }

    store.loginGuest = function () {
        async function asyncGuest() {
            let response = await api.getPublishedPlaylists("", CurrentHomeScreen.ALL_LISTS, SortType.NAME);
            if (response.data.success) {
                let infoArray = response.data.data;
                storeReducer({
                    type: GlobalStoreActionType.VIEW_AS_GUEST,
                    payload: { guest: true, listInfo: infoArray, screen: CurrentHomeScreen.ALL_LISTS }
                });
            }
        }
        asyncGuest();
    }

    store.logoutGuest = function () {
        async function asyncGuest() {
            let response = await api.getPublishedPlaylists("", CurrentHomeScreen.ALL_LISTS, SortType.NAME);
            if (response.data.success) {
                let infoArray = response.data.data;
                storeReducer({
                    type: GlobalStoreActionType.VIEW_AS_GUEST,
                    payload: { guest: false, listInfo: infoArray, screen: CurrentHomeScreen.HOME }
                });
            }
        }
        asyncGuest();
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