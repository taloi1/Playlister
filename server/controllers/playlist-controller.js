const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({ success: true });
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!1");
                    return res.status(400).json({
                        errorMessage: "authentication error"
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        if (list.isPublished === true) {
            console.log("Published List!");
            return res.status(200).json({ success: true, playlist: list })
        }
        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    return res.status(200).json({ success: true, playlist: list })
                }
                else {
                    console.log("incorrect user!2");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getPlaylistInfo = async (req, res) => {
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {

                    console.log("HERE!!!!!!!!!!!!");
                    console.log(playlists);
                    console.log(req.query);
                    console.log("HERE????");

                    // FILTER FROM SEARCH BAR
                    if (req.query.search) {
                        playlists = playlists.filter(list => list.name.toLowerCase().includes(req.query.search.toLowerCase()));
                    }

                    // SORT FROM SELECTED SORT TYPE
                    if (req.query.sortType) {
                        // sort by name no matter what, apply other sorts after
                        playlists.sort((a, b) => {
                            const nameA = a.name.toLowerCase();
                            const nameB = b.name.toLowerCase();
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        });
                        if (req.query.sortType === "PUBLISH_DATE") {
                            playlists.sort((a, b) => {
                                if (a.publishDate > b.publishDate) {
                                    return -1;
                                }
                                if (a.publishDate < b.publishDate) {
                                    return 1;
                                }
                                return 0;
                            });
                            console.log("PUBLISH");
                            console.log(playlists);
                        }
                        if (req.query.sortType === "EDIT_DATE") {
                            playlists.sort((a, b) => {
                                if (a.updatedAt > b.updatedAt) {
                                    return -1;
                                }
                                if (a.updatedAt < b.updatedAt) {
                                    return 1;
                                }
                                return 0;
                            });
                            console.log("EDIT");
                            console.log(playlists);
                        }
                        if (req.query.sortType === "LISTENS") {
                            playlists.sort((a, b) => {
                                if (a.listens > b.listens) {
                                    return -1;
                                }
                                if (a.listens < b.listens) {
                                    return 1;
                                }
                                return 0;
                            });
                            console.log("LISTENS");
                            console.log(playlists);
                        }
                        if (req.query.sortType === "LIKES") {
                            playlists.sort((a, b) => {
                                if (a.likes > b.likes) {
                                    return -1;
                                }
                                if (a.likes < b.likes) {
                                    return 1;
                                }
                                return 0;
                            });
                            console.log("LIKES");
                            console.log(playlists);
                        }
                        if (req.query.sortType === "DISLIKES") {
                            playlists.sort((a, b) => {
                                if (a.dislikes > b.dislikes) {
                                    return -1;
                                }
                                if (a.dislikes < b.dislikes) {
                                    return 1;
                                }
                                return 0;
                            });
                            console.log("DISLIKES");
                            console.log(playlists);
                        }
                    }

                    // RETURN FILTERED AND SORTED PLAYLISTS
                    return res.status(200).json({ success: true, listInfo: playlists })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPublishedPlaylists = async (req, res) => {
    await Playlist.find({ isPublished: true }, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        console.log(playlists);
        console.log(req.query);
        if (req.query.search && req.query.screen) {
            if (req.query.screen === 'ALL_LISTS') {
                playlists = playlists.filter(list => list.name.toLowerCase().includes(req.query.search.toLowerCase()));
            }
            if (req.query.screen === 'USERS') {
                playlists = playlists.filter(list => list.ownerUserName.toLowerCase().includes(req.query.search.toLowerCase()));
            }
        }

        // SORT FROM SELECTED SORT TYPE
        if (req.query.sortType) {
            // sort by name no matter what, apply other sorts after
            playlists.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            console.log("NAME");
            console.log(playlists);
            if (req.query.sortType === "PUBLISH_DATE") {
                playlists.sort((a, b) => {
                    if (a.publishDate > b.publishDate) {
                        return -1;
                    }
                    if (a.publishDate < b.publishDate) {
                        return 1;
                    }
                    return 0;
                });
                console.log("PUBLISH");
                console.log(playlists);
            }
            if (req.query.sortType === "EDIT_DATE") {
                playlists.sort((a, b) => {
                    if (a.updatedAt > b.updatedAt) {
                        return -1;
                    }
                    if (a.updatedAt < b.updatedAt) {
                        return 1;
                    }
                    return 0;
                });
                console.log("EDIT");
                console.log(playlists);
            }
            if (req.query.sortType === "LISTENS") {
                playlists.sort((a, b) => {
                    if (a.listens > b.listens) {
                        return -1;
                    }
                    if (a.listens < b.listens) {
                        return 1;
                    }
                    return 0;
                });
                console.log("LISTENS");
                console.log(playlists);
            }
            if (req.query.sortType === "LIKES") {
                playlists.sort((a, b) => {
                    if (a.likes > b.likes) {
                        return -1;
                    }
                    if (a.likes < b.likes) {
                        return 1;
                    }
                    return 0;
                });
                console.log("LIKES");
                console.log(playlists);
            }
            if (req.query.sortType === "DISLIKES") {
                playlists.sort((a, b) => {
                    if (a.dislikes > b.dislikes) {
                        return -1;
                    }
                    if (a.dislikes < b.dislikes) {
                        return 1;
                    }
                    return 0;
                });
                console.log("DISLIKES");
                console.log(playlists);
            }
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                // Only change name and songs, or publish a list if a list is unpublished
                if (list.isPublished === false && user._id == req.userId) {
                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.publishDate = body.playlist.publishDate;
                    if (list.songs.length > 0) {
                        list.isPublished = body.playlist.isPublished;
                    }
                }
                // Only change likes, dislikes, and listens when a list is already published
                if (list.isPublished === true) {
                    list.likes = body.playlist.likes;
                    list.dislikes = body.playlist.dislikes;
                    list.likedUsers = body.playlist.likedUsers;
                    list.dislikedUsers = body.playlist.dislikedUsers;
                    list.listens = body.playlist.listens;
                }
                list.comments = body.playlist.comments;
                list
                    .save()
                    .then(() => {
                        console.log("SUCCESS!!!");
                        return res.status(200).json({
                            success: true,
                            id: list._id,
                            message: 'Playlist updated!',
                        })
                    })
                    .catch(error => {
                        console.log("FAILURE: " + JSON.stringify(error));
                        return res.status(404).json({
                            error,
                            message: 'Playlist not updated!',
                        })
                    })

            });
        }
        asyncFindUser(playlist);
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistInfo,
    getPublishedPlaylists,
    updatePlaylist
}