var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const path = require("path");
const app = express();
const fs = require('fs')

const scopes = [
  'ugc-image-upload',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

var spotifyApi = new SpotifyWebApi({
  clientId: 'a824c0a83dcb48cb836eb960190412eb',
  clientSecret: 'c30ebf0b3b164e1f96d905d0ce5c53cf',
  redirectUri: 'http://localhost:8888/callback'

});
app.use(express.json());
app.use(express.static(path.join(__dirname, "")));

app.get('/', (req, res) => {

  if (access_token == '') {
    console.log('index');
    const indexFile = path.join(__dirname, "/index.html");
    res.sendFile(indexFile);
  } else {
    console.log('menu');
    const menuFile = path.join(__dirname, "/menu.html");
    res.sendFile(menuFile);
  }
});

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      //console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      const menuFile = path.join(__dirname, "/menu.html");
      res.sendFile(menuFile);
      //res.send('Success! You can now close the window.');
      //res.send(access_token);


      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);

      }, expires_in / 100 * 1000);

    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

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
  let keyword = req.query.keyword.replace(/_/g, ' ');
  let data = searchArtistPresentation(keyword)
  data.then(function(result) {
    //console.log(result)
    res.send(result)
  })
}); //ex : http://localhost:8888/getMySavedTracks/?amount=10

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

app.get('/getPresentationRecentPlayed', function(req, res) {
  let amount = req.query.amount;
  let data = getPresentationRecentPlayed(amount);
  data.then(function(result) {
    //console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/getPresentationRecentPlayed/?amount=10

app.get('/getUserPlaylists', function(req, res) {
  let data = getUserPlaylists(getMyID());
  data.then(function(result) {
    console.log(result);
    res.send(result);
  })
}); //ex : http://localhost:8888/getUserPlaylists

app.get('/search', function(req, res) {
  let type = req.query.type;
  let keyword = req.query.keyword.replace(/_/g, ' ');
  if (type == "playlist") {
    let data = searchPlaylistsPresentation(keyword);
    data.then(function(result) {
      //console.log(result)
      res.send(result);
    })
  } else if (type == "artiste") {
    let data = searchArtistPresentation(keyword);
    data.then(function(result) {
      //console.log(result)
      res.send(result);
    })
  } else {
    let data = searchTracksPresentation(keyword);
    data.then(function(result) {
      //console.log(result)
      res.send(result);
    })
  }
}); //ex : http://localhost:8888/search/?type=titre&keyword=hotel_california
//ex : http://localhost:8888/search/?type=playlist&keyword=street_cred
//ex : http://localhost:8888/search/?type=artiste&keyword=iron_maiden

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

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888 in your browser.'
  )
);

////////////////////////////////////////// Fonctions API /////////////////////////////////////////////////

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
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName, nbSongs = 100) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: nbSongs,
    fields: 'items'
  })

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
  let data = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: nbRecentSongs
  })
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

async function searchArtists(research) {
  spotifyApi.searchArtists(research)
    .then(function(data) {
      console.log('Search artists by ' + research, data.body['artists']);
      //data.body.items.forEach(item => console.log(item.track));
    }, function(err) {
      console.error(err);
    });
}

async function searchArtistPresentation(research) {
  //display parsed songs using a keyword
  let data = await spotifyApi.searchArtists(research);
  let artistsFromSearch = [];
  data.body.artists.items.forEach(item => artistsFromSearch.push([item.popularity, item.id]));
  var col = artistsFromSearch.map(function(elem) {
    return elem[0]; //to get all the column 2 values
  });
  var index = col.indexOf(Math.max(...col));
  let topTracks = await spotifyApi.getArtistTopTracks(artistsFromSearch[index][1], 'FR')
  let topTracksFromSearchedArtist = []
  topTracks.body.tracks.forEach(item => topTracksFromSearchedArtist.push([item['name'],
    item.album.artists[0].name,
    millisToMinutesAndSeconds(item['duration_ms']),
    item.album.images[0]['url'],
    item['preview_url'],
    item['uri']
  ]));
  return topTracksFromSearchedArtist;
}

async function searchPlaylists(research) {
  spotifyApi.searchPlaylists(research)
    .then(function(data) {
      console.log('Found playlists are', data.body['playlists']);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function searchPlaylistsPresentation(research) {
  //display parsed songs using a keyword
  let data = await spotifyApi.searchPlaylists(research)
  return getPresentationSongsPlaylist(data.body.playlists.items[0].id)
}

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
  let data = await spotifyApi.getPlaylist(playlistID)
  let songsUriFromPlaylist = []
  data.body.tracks.items.forEach(item => songsUriFromPlaylist.push(
    item.track['uri']
  ));
  //console.log(songsFromPlaylist)    
  return songsUriFromPlaylist;
}

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

function millisToMinutesAndSeconds(millis) {
  //Converts ms to min and sec
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}