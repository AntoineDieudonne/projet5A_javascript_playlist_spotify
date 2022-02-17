const fs = require('fs')
const path = require("path");
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQClEv5KioZX49ackbf9DGvkIgOwtlqVDKFE7Hq6RShRPKzKCj2ECJJRAf-FvRMf_nXQA2C3litmNzv6xVIjwLwnxPzzVuPjRvTn6Y2SjVq9ruzJ2IDSzg1D20jJTjmsD3ijPW35Hf443FEeZJTaUL_ZQcIR_8Q0AmzbOQlGvsr0fLts__Op4LUZ3PN2rfelL8cZ40CjxYoPXJ4gVwk6OFTAiLEkzTI79fL5p8DhGt4C0BsAK3OmU-qufwut2Z306EkDGWMF8jXjHiMgmhykfNaJHdgmQ1Nad5K9MeHgk2_rGUEC"
const spotifyApi = new SpotifyWebApi();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "")));

spotifyApi.setAccessToken(token);



//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    console.log(me.body);
  })().catch(e => {
    console.error(e);
  });
}

function getMyID() {
  (async () => {
    const me = await spotifyApi.getMe();
    //console.log(me.body['id']);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylistsParsed(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    console.log("----")
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    //console.log(tracks);

    //const tracksJSON = { tracks }
    //let data = JSON.stringify(tracksJSON);
    //fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName, nbSongs = 100) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: nbSongs,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }

  console.log("---------------")
  return tracks;
}

async function newPlaylist(playlistname) {
  //add a new playlist to the user
  spotifyApi.createPlaylist(playlistname)
  console.log("playlist : " + playlistname + " was created");
}

async function getRecentPlayed(nbRecentSongs = 20) {
  //Note that the response will be empty in case the user has enabled private session.

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Your " + data.body.items.length + " most recently played tracks are:");
    data.body.items.forEach(item => console.log(item.track));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getNameRecentPlayed(nbRecentSongs = 20) {
  //Gets song name of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Gets song name of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(item.track['name']));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getArtistRecentPlayed(nbRecentSongs = 20) {
  //Gets artist name of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Gets artist name of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(item.track.album.artists[0].name));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getImage640x640RecentPlayed(nbRecentSongs = 20) {
  //Gets image url size 640x640 of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Gets image url size 640x640 of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(item.track.album.images[0]['url']));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getImage300x300RecentPlayed(nbRecentSongs = 20) {
  //Gets image url size 300x300 of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Gets image url size 300x300 of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(item.track.album.images[1]['url']));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getImage64x64RecentPlayed(nbRecentSongs = 20) {
  //Gets image url size 64x64 of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Gets image url size 64x64 of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(item.track.album.images[2]['url']));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function get30secSampleRecentPlayed(nbRecentSongs = 20) {
  //Gets 30sec Sample of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Gets 30sec Sample of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(item.track['preview_url']));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getLengthRecentPlayed(nbRecentSongs = 20) {
  //Get length of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Gets 30sec Sample of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(millisToMinutesAndSeconds(item.track['duration_ms'])));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}


async function getIDRecentPlayed(nbRecentSongs = 20) {
  //Get id of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  }).then(function(data) {
    // Output items
    console.log("Get id of the last " + data.body.items.length + " song played:");
    data.body.items.forEach(item => console.log(['spotify:track:' + item.track.album['id']]));
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}


async function getPresentationRecentPlayed(nbRecentSongs = 20) {
  //Gets Track name, artist name, image url and 30 sec preview of the last nbRecentSongs song played
  let data = await spotifyApi.getMyRecentlyPlayedTracks({limit : nbRecentSongs})
  let songsFromRecentPlayed = []
  console.log("Gets Track name, artist name and image url of the last " + data.body.items.length + " song played:");
  data.body.items.forEach(item => songsFromRecentPlayed.push([item.track['name'],
    item.track.album.artists[0].name,
    millisToMinutesAndSeconds(item.track['duration_ms']),
    item.track.album.images[0]['url'],
    item.track['preview_url'],
    item.track['uri']
  ]));
  //console.log(songsFromRecentPlayed);
  return songsFromRecentPlayed;
}

/*
let data = getPresentationRecentPlayed(2)
data.then(function(result) {
  console.log(result)
})*/

async function searchArtists(research) {
  spotifyApi.searchArtists(research)
    .then(function(data) {
      console.log('Search artists by ' + research, data.body['artists']);
      //data.body.items.forEach(item => console.log(item.track));
    }, function(err) {
      console.error(err);
    });
}

async function searchArtistsPresentation(research) {
  //display parsed songs using a keyword
  let data = await spotifyApi.searchArtists(research)
  let artistsFromSearch = []
  for (let artists of data.body.artists.items) {
    try {
      artistsFromSearch.push([artists.name, artists.id, artists.images[0]['url']])
    } catch (error) {
      artistsFromSearch.push([artists.name, artists.id, null])
    }
  }
  //console.log(artistsFromSearch);
  return artistsFromSearch;
}

/*
let data = searchArtistsPresentation("Dio")
data.then(function(result) {
  console.log(result)
})*/

async function searchPlaylists(research) {
  spotifyApi.searchPlaylists(research)
    .then(function(data) {
      console.log('Found playlists are', data.body['playlists']);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function unfollowPlaylist(playlistId) {
  spotifyApi.unfollowPlaylist(playlistId)
    .then(function(data) {
      console.log('Unfollowed Playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function followPlaylist(playlistId) {
  spotifyApi.followPlaylist(playlistId)
    .then(function(data) {
      console.log('Unfollowed Playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function searchPlaylistsPresentation(research) {
  //display parsed songs using a keyword
  let data = await spotifyApi.searchPlaylists(research)
  let playlistFromSearch = []
  for (let playlist of data.body.playlists.items) {
    try {
      playlistFromSearch.push([playlist.name, playlist.id, playlist.images[0]['url']])
    } catch (error) {
      playlistFromSearch.push([playlist.name, playlist.id, null])
    }
  }
  //console.log(playlistFromSearch);
  return playlistFromSearch;
}

/*
let data = searchPlaylistsPresentation("street cred")
data.then(function(result) {
  console.log(result)
})*/

async function searchTracks(research) {
  spotifyApi.searchTracks(research)
    .then(function(data) {
      console.log('Search by ' + research, data.body['tracks']);
    }, function(err) {
      console.error(err);
    });
}

async function searchTracksPresentation(research) {
  //display parsed songs using a keyword
  let data = await spotifyApi.searchTracks(research)
  let songsFromSearch = []
  //console.log(data.body.tracks.items)
  data.body.tracks.items.forEach(item => songsFromSearch.push([item['name'],
    item.album.artists[0].name,
    millisToMinutesAndSeconds(item['duration_ms']),
    item.album.images[0]['url'],
    item['preview_url'],
    item['uri']
  ]));
  //console.log(songsFromSearch);
  return songsFromSearch;
}


/*let data = searchTracksPresentation("hotel california")
data.then(function(result) {
  console.log(result)
})*/

async function addTracksToPlaylist(playlistID, trackTab) {
  // Add tracks to a playlist //track ["spotify:track:trackID"]
  spotifyApi.addTracksToPlaylist(playlistID, trackTab)
    .then(function(data) {
      console.log('Added tracks to playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function addTracksToPlaylistInPos(playlistID, trackTab, pos) {
  // Add tracks to a specific position in a playlist
  spotifyApi.addTracksToPlaylist(playlistID, trackTab, {
      position: pos
    })
    .then(function(data) {
      console.log('Added tracks to playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function reorderTracksInPlaylist(playlistID, posTrack1, posTrack2) {
  // Reorder the first two tracks in a playlist to the place before the track at the 10th position
  var options = {
    "range_length": 1
  };
  spotifyApi.reorderTracksInPlaylist(playlistID, posTrack1, posTrack2, options)
    .then(function(data) {
      console.log('Tracks reordered in playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function removeTrackFromPlaylistByPosition(playlistId, tabPosTrack, snapshotID) {
  // Remove tracks from a playlist at a specific position
  spotifyApi.removeTrackFromPlaylistByPosition(playlistId, tabPosTrack, snapshotID)
    .then(function(data) {
      console.log('Tracks removed from playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function removeTrackFromPlaylist(playlistId, tracks) {
  // Remove all occurrence of a track
  var tracks = [{
    uri: tracks
  }];
  var playlistId = playlistId;
  spotifyApi.removeTrackFromPlaylist(playlistId, tracks)
    .then(function(data) {
      //console.log(data);
      console.log('Tracks removed from playlist!');
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getUserPlaylists(userName) {
  // Get a user's playlists Name and ID
  const data = await spotifyApi.getUserPlaylists(userName)
  let playlists = []
  for (let playlist of data.body.items) {
    try {
      playlists.push([playlist.name, playlist.id, playlist.images[0]['url']])
    } catch (error) {
      playlists.push([playlist.name, playlist.id, null])
    }

  }
  //console.log(playlists)
  return playlists;
}



/*
let data = getUserPlaylists(getMyID())
data.then(function(result) {
  console.log(result)
})*/


async function getPlaylist(playlistID) {
  // Get a specific playlist
  spotifyApi.getPlaylist(playlistID)
    .then(function(data) {
      console.log('Some information about this playlist', data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getPresentationSongsPlaylist(playlistID) {
  // Get full presentation of a specific playlist
  let data = await spotifyApi.getPlaylist(playlistID)
  let songsFromPlaylist = []
  data.body.tracks.items.forEach(item => songsFromPlaylist.push([item.track['name'],
    item.track.album.artists[0].name,
    millisToMinutesAndSeconds(item.track['duration_ms']),
    item.track.album.images[0]['url'],
    item.track['preview_url'],
    item.track['uri']
  ]));
  //console.log(songsFromPlaylist)    
  return songsFromPlaylist;
}

async function getSongsUriPlaylist(playlistID) {
  // Get full presentation of a specific playlist
  let data = await spotifyApi.getPlaylist(playlistID)
  let songsUriFromPlaylist = []
  data.body.tracks.items.forEach(item => songsUriFromPlaylist.push(
    item.track['uri']
  ));
  //console.log(songsFromPlaylist)    
  return songsUriFromPlaylist;
}


async function getMySavedTracks(nbSavedSongs = 20) {
  //Note that the response will be empty in case the user has enabled private session.
  let data = await spotifyApi.getMySavedTracks({
    limit: nbSavedSongs
  })
  let mySavedSongs = []
  data.body.items.forEach(item => mySavedSongs.push([item.track['name'],
    item.track.album.artists[0].name,
    millisToMinutesAndSeconds(item.track['duration_ms']),
    item.track.album.images[0]['url'],
    item.track['preview_url'],
    item.track['uri']
  ]));
  //console.log(songsFromPlaylist)    
  return mySavedSongs;
}

/*
let data = getSongsUriPlaylist('1Dm4Nr0mpgCAqJPzcfs5vS')
data.then(function(result) {
  console.log(result)
})*/

async function getSnapshotPlaylist(playlistID) {
  // Get a playlist snapshot_id
  spotifyApi.getPlaylist(playlistID)
    .then(function(data) {
      console.log('Le snapshot ID :', data.body['snapshot_id']);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function changePlaylistDetails(playlistID, text, desc, boolpublic) {
  // Change playlist details
  spotifyApi.changePlaylistDetails(playlistID, {
    "name": text,
    "description": desc,
    'public': boolpublic
  }).then(function(data) {
    console.log('Playlist detail is change!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getAlbumTracks(albumID) {
  // Get tracks in an album
  spotifyApi.getAlbumTracks(albumID, {
      limit: 10,
      offset: 0
    })
    .then(function(data) {
      console.log(data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getArtistAlbums(artistID) {
  // Get albums by a certain artist
  spotifyApi.getArtistAlbums(artistID)
    .then(function(data) {
      console.log('Artist albums', data.body);
    }, function(err) {
      console.error(err);
    });
}

async function getAlbum(albumID) {
  // Get album
  spotifyApi.getAlbum(albumID)
    .then(function(data) {
      console.log('Album information', data.body);
    }, function(err) {
      console.error(err);
    });
}

async function getArtist(artistID) {
  // Get an artist
  spotifyApi.getArtist(artistID)
    .then(function(data) {
      console.log('Artist information', data.body);
    }, function(err) {
      console.error(err);
    });
}


function millisToMinutesAndSeconds(millis) {
  //Converts ms to min and sec
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//getMyData();
//newPlaylist("testapi");
//getMyID()
//getrecentplayed();
//searchArtists("Jul");
//searchPlaylists("Hit");
//searchTracks("Waka");
//addTracksToPlaylist('1Dm4Nr0mpgCAqJPzcfs5vS',['spotify:track:3dyoo6UNb2VlMTISBqrDb1','spotify:track:4yE3KKg74Oy4ZwBLTDtlxo'])
/*
let data = getPresentationSongsPlaylist('1Dm4Nr0mpgCAqJPzcfs5vS')
data.then(function(result) {
  console.log(result)
})*/

//addTracksToPlaylistInPos('7bIHXyxXbfnpcYCZb2mfT2',['spotify:track:5Sg3FtU1fSUgj0QTl0P4kX'],0)
//reorderTracksInPlaylist('7bIHXyxXbfnpcYCZb2mfT2',1,3); //avec 0,3 c'est le premier son qui va à la position 3, avec 1 c'est le deuxième...
//removeTrackFromPlaylistByPosition('7bIHXyxXbfnpcYCZb2mfT2',[1],'MTcsZWNhNDY1NDViMzdiMjcwZTYwMGE2OTU4NDVlNWU2MDg0ZDM3ZmM5Mg=='); //la position est la liste commençant à 0
/////////snapshot id est une version de la playlist, la version change quand la modifie, il faut donc renseigner le nouveau snpashot pour les modifs
//removeTrackFromPlaylist('7bIHXyxXbfnpcYCZb2mfT2','spotify:track:38QAnJnnYc1tzDtJnoTZHq');
//getPlaylist('7bIHXyxXbfnpcYCZb2mfT2');
//changePlaylistDetails('7bIHXyxXbfnpcYCZb2mfT2',"testapi","New detail", true);
//getAlbumTracks('4YdMS0CiZ3Il1tCQfi4E2E');
//getArtistAlbums('3IW7ScrzXmPvZhB27hmfgy');
//getAlbum('4YdMS0CiZ3Il1tCQfi4E2E');
//getArtist('3IW7ScrzXmPvZhB27hmfgy');

//////pour recuperrer une informations soit c'est un objet (albums, artistes) donc on met : .objet
//////soit c'est une propriété on met : ['propiete']

//getnamerecentplayed(); //modifié pour recup que le nom des musiques et pas l'objet entier
//getSnapshotPlaylist('7bIHXyxXbfnpcYCZb2mfT2'); //modifié pour recup le snashoatID
//getartistrecentplayed();

app.get('/unfollowPlaylist', function(req, res) {
  let id = req.query.id;
  let data = unfollowPlaylist(id);
  data.then(function(result) {
    console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/unfollowPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS

app.get('/followPlaylist', function(req, res) {
  let id = req.query.id;
  let data = followPlaylist(id);
  data.then(function(result) {
    console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/followPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS

app.get('/getMySavedTracks', function(req, res) {
  let amount = req.query.amount;
  let data = getMySavedTracks(amount);
  data.then(function(result) {
    //console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/getMySavedTracks/?amount=10

app.get('/getPresentationRecentPlayed', function(req, res) {
  let amount = req.query.amount;
  let data = getPresentationRecentPlayed(amount);
  data.then(function(result) {
    //console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/getPresentationRecentPlayed/?amount=10

app.get('/newPlaylist', function(req, res) {
  let nomPlaylist = req.query.nomPlaylist.replace(/_/g, ' ');
  newPlaylist(nomPlaylist);
}); //ex : http://localhost:8888/newPlaylist/?nomPlaylist=Pléliste_test

app.get('/removeTrackFromPlaylist', function(req, res) {
  let idPlaylist = req.query.id;
  let songUri = req.query.uri;
  removeTrackFromPlaylist(idPlaylist, songUri);
}); //ex : http://localhost:8888/removeTrackFromPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS&uri=spotify:track:3dyoo6UNb2VlMTISBqrDb1

app.get('/reorderTrackInPlaylist', function(req, res) {
  let idPlaylist = req.query.id;
  let posStart = parseInt(req.query.posStart);
  let posEnd = parseInt(req.query.posEnd);
  let playlistUri = getSongsUriPlaylist(idPlaylist)
  playlistUri.then(function(result) {
    if (posStart < result.length) {
      if (posEnd < result.length) {
        reorderTracksInPlaylist(idPlaylist, posStart, posEnd);
      }
    }
  })
}); //ex : http://localhost:8888/reorderTrackInPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS&posStart=0&posEnd=3

app.get('/addTracksToPlaylistInPos', function(req, res) {
  let idPlaylist = req.query.id;
  let songUri = req.query.uri.split("_");
  let playlistUri = getSongsUriPlaylist(idPlaylist)
  let pos = req.query.pos;
  playlistUri.then(function(result) {
    if (parseInt(pos) > result.length) {
      pos = 0
    }
    songUri = songUri.filter(val => !result.includes(val));
    if (songUri.length > 0) {
      addTracksToPlaylistInPos(idPlaylist, songUri, pos)
    }
  })
}); //ex : http://localhost:8888/addTracksToPlaylistInPos/?id=1Dm4Nr0mpgCAqJPzcfs5vS&uri=spotify:track:0OF6WSdeVmYEGBZlxvwvLq_spotify:track:2HzJCYwtTXqrj72mE2hnEW&pos=1


app.get('/addTracksToPlaylist', function(req, res) {
  let idPlaylist = req.query.id;
  let songUri = req.query.uri.split("_");
  let playlistUri = getSongsUriPlaylist(idPlaylist)
  playlistUri.then(function(result) {
    songUri = songUri.filter(val => !result.includes(val));
    if (songUri.length > 0) {
      addTracksToPlaylist(idPlaylist, songUri)
    }
  })
}); //ex : http://localhost:8888/addTracksToPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS&uri=spotify:track:3dyoo6UNb2VlMTISBqrDb1_spotify:track:4yE3KKg74Oy4ZwBLTDtlxo

app.get('/getPresentationSongsPlaylist', function(req, res) {
  let id = req.query.id;
  let data = getPresentationSongsPlaylist(id);
  data.then(function(result) {
    //console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/getPresentationSongsPlaylist/?id=1RhhvhdE7Kro3HN6lL5Sje

app.get('/searchTracksPresentation', function(req, res) {
  let keyword = req.query.keyword.replace(/_/g, ' ');
  let data = searchTracksPresentation(keyword)
  data.then(function(result) {
    //console.log(result)
    res.send(result)
  })
}); //ex : http://localhost:8888/searchTracksPresentation/?keyword=hotel_california

app.get('/getUserPlaylists', function(req, res) {
  let data = getUserPlaylists(getMyID());
  data.then(function(result) {
    //console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/getUserPlaylists

app.get('/searchPlaylistsPresentation', function(req, res) {
  let keyword = req.query.keyword.replace(/_/g, ' ');
  let data = searchPlaylistsPresentation(keyword)
  data.then(function(result) {
    //console.log(result)
    res.send(result)
  })
}); //ex : http://localhost:8888/searchPlaylistsPresentation/?keyword=street_cred

app.get('/searchArtistsPresentation', function(req, res) {
  let keyword = req.query.keyword.replace(/_/g, ' ');
  let data = searchArtistsPresentation(keyword)
  data.then(function(result) {
    //console.log(result)
    res.send(result)
  })
}); //ex : http://localhost:8888/searchArtistsPresentation/?keyword=iron_maiden

app.get('/menu', function(req, res) {
  console.log('menu');
  const menuFile = path.join(__dirname, "/menu.html");
  res.header("Content-Type", "text/html")
  res.sendFile(menuFile);
});

app.get('/playlist', function(req, res) {
  console.log('playlist');
  const playlistFile = path.join(__dirname, "/playlist.html");
  res.header("Content-Type", "text/html")
  res.sendFile(playlistFile);
});

app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/back in your browser.'
  )
);