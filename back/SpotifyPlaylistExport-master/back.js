const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQCsJ3ThQfXNfPFoWcXUj9aNIfPzvYn-etp7-lyXW23yuUdXuAIYbkcoLdWo3Akwt_PmuRYrUJdHqatP81sk3NSZsbDF5m-ITaXCvUVMS7y-M5gdkgQ8ar1txQeCJpB9eMtbpr7VIU_fx9WK3Ke2f_ZRB2yzD6NiWgcjd_KgDpVdsmPmYKOcYQKdtW0YnHb3ajeOGnNn1kjnjoTk-SQ_ZJu_KnTT4Bdsvflf0yHifrhuitPEGXuxs7jNWV5ehevbN6aUOTDTNDnw8r74Xle3zN4ULpTlzm-Xuf3o4IYrI7PpF2yy"
const spotifyApi = new SpotifyWebApi();
const nbRecentSongs = 20
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
    console.log(me.body['id']);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylistsParsed(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body .items) {
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
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
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
  console.log("playlist : "+playlistname+" was created");
}

async function getRecentPlayed() {
  //Note that the response will be empty in case the user has enabled private session.
  
    spotifyApi.getMyRecentlyPlayedTracks({
      limit : nbRecentSongs
    }).then(function(data) {
        // Output items
        console.log("Your "+data.body.items.length+" most recently played tracks are:");
        data.body.items.forEach(item => console.log(item.track));
      }, function(err) {
        console.log('Something went wrong!', err);
      });
  }

async function getNameRecentPlayed() {
//Gets song name of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets song name of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(item.track['name']));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getArtistRecentPlayed() {
//Gets artist name of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets artist name of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(item.track.album.artists[0].name));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getImage640x640RecentPlayed() {
//Gets image url size 640x640 of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets image url size 640x640 of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(item.track.album.images[0]['url']));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getImage300x300RecentPlayed() {
//Gets image url size 300x300 of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets image url size 300x300 of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(item.track.album.images[1]['url']));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getImage64x64RecentPlayed() {
//Gets image url size 64x64 of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets image url size 64x64 of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(item.track.album.images[2]['url']));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function get30secSampleRecentPlayed() {
//Gets 30sec Sample of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets 30sec Sample of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(item.track['preview_url']));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getLengthRecentPlayed() {
//Get length of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets 30sec Sample of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(millisToMinutesAndSeconds(item.track['duration_ms'])));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}


async function getIDRecentPlayed() {
//Get id of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Get id of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log('spotify:track:'+item.track.album['id']));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function getPresentationRecentPlayed() {
//Gets Track name, artist name, image url and 30 sec preview of the last nbRecentSongs song played

  spotifyApi.getMyRecentlyPlayedTracks({
    limit : nbRecentSongs
  }).then(function(data) {
      // Output items
      console.log("Gets Track name, artist name and image url of the last "+data.body.items.length+" song played:");
      data.body.items.forEach(item => console.log(item.track['name']));
      data.body.items.forEach(item => console.log(item.track.album.artists[0].name));    
      data.body.items.forEach(item => console.log(millisToMinutesAndSeconds(item.track['duration_ms'])));  
      data.body.items.forEach(item => console.log(item.track.album.images[2]['url']));
      data.body.items.forEach(item => console.log(item.track['preview_url']));
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}


async function searchArtists(research){
  spotifyApi.searchArtists(research)
  .then(function(data) {
    console.log('Search artists by ' + research, data.body['artists']);
    //data.body.items.forEach(item => console.log(item.track));
  }, function(err) {
    console.error(err);
  });
}

async function searchPlaylists(research){
  spotifyApi.searchPlaylists(research)
  .then(function(data) {
    console.log('Found playlists are', data.body['playlists']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function searchTracks(research){
  spotifyApi.searchTracks(research)
  .then(function(data) {
    console.log('Search by ' + research, data.body['tracks']);
  }, function(err) {
    console.error(err);
  });
}

async function addTracksToPlaylist(playlistID,trackTab){
  // Add tracks to a playlist //track ["spotify:track:trackID"]
  spotifyApi.addTracksToPlaylist(playlistID, trackTab)
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function addTracksToPlaylistInPos(playlistID, trackTab,pos){
  // Add tracks to a specific position in a playlist
  spotifyApi.addTracksToPlaylist(playlistID, trackTab,
  {
    position : pos
  })
  .then(function(data) {
    console.log('Added tracks to playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function reorderTracksInPlaylist(playlistID, posTrack1, posTrack2){
// Reorder the first two tracks in a playlist to the place before the track at the 10th position
  var options = { "range_length" : 1 };
  spotifyApi.reorderTracksInPlaylist(playlistID, posTrack1, posTrack2, options)
  .then(function(data) {
    console.log('Tracks reordered in playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function removeTracksFromPlaylistByPosition(playlistId, tabPosTrack, snapshotID){
// Remove tracks from a playlist at a specific position
  spotifyApi.removeTracksFromPlaylistByPosition(playlistId, tabPosTrack,snapshotID)
  .then(function(data) {
    console.log('Tracks removed from playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function removeTracksFromPlaylist(playlistId, tracks){
// Remove all occurrence of a track
  var tracks = [{ uri : tracks}];
  var playlistId = playlistId;
  spotifyApi.removeTracksFromPlaylist(playlistId, tracks)
  .then(function(data) {
    //console.log(data);
    console.log('Tracks removed from playlist!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getUserPlaylistsNameAndID(userName){
// Get a user's playlists Name and ID
  const data = await spotifyApi.getUserPlaylists(userName)
  let playlists = []
  for (let playlist of data.body.items) {
    //console.log(playlist.name + " " + playlist.id)
  }
}

getUserPlaylistsNameAndID(getMyID());

async function getPlaylist(playlistID){
// Get a playlist
  spotifyApi.getPlaylist(playlistID)
  .then(function(data) {
    console.log('Some information about this playlist', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getSnapshotPlaylist(playlistID){
  // Get a playlist
    spotifyApi.getPlaylist(playlistID)
    .then(function(data) {
      console.log('Le snapshot ID :',data.body['snapshot_id']);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
}

async function changePlaylistDetails(playlistID, text, desc,boolpublic){
// Change playlist details
  spotifyApi.changePlaylistDetails(playlistID,
  {
    "name": text,  "description": desc, 'public' : boolpublic
  }).then(function(data) {
     console.log('Playlist detail is change!');
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getAlbumTracks(albumID){
// Get tracks in an album
  spotifyApi.getAlbumTracks(albumID, { limit : 10, offset : 0 })
  .then(function(data) {
    console.log(data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

async function getArtistAlbums(artistID){
// Get albums by a certain artist
  spotifyApi.getArtistAlbums(artistID)
  .then(function(data) {
    console.log('Artist albums', data.body);
  }, function(err) {
    console.error(err);
  });
}

async function getAlbum(albumID){
  // Get album
  spotifyApi.getAlbum(albumID)
  .then(function(data) {
    console.log('Album information', data.body);
  }, function(err) {
    console.error(err);
  });
}

async function getArtist(artistID){
// Get an artist
  spotifyApi.getArtist(artistID)
  .then(function(data) {
    console.log('Artist information', data.body);
  }, function(err) {
    console.error(err);
  });
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//getMyData();
//newPlaylist("testapi");
//getUserPlaylistsParsed(getMyID());

//getrecentplayed();
//searchArtists("Jul");
//searchPlaylists("Hit");
//searchTracks("Waka");
//addTracksToPlaylist('1Dm4Nr0mpgCAqJPzcfs5vS',['spotify:track:2e1znWHgx5QqSBQlqYwv0F'])
//addTracksToPlaylistInPos('7bIHXyxXbfnpcYCZb2mfT2',['spotify:track:5Sg3FtU1fSUgj0QTl0P4kX'],0)
//reorderTracksInPlaylist('7bIHXyxXbfnpcYCZb2mfT2',1,3); //avec 0,3 c'est le premier son qui va à la position 3, avec 1 c'est le deuxième...
//removeTracksFromPlaylistByPosition('7bIHXyxXbfnpcYCZb2mfT2',[1],'MTcsZWNhNDY1NDViMzdiMjcwZTYwMGE2OTU4NDVlNWU2MDg0ZDM3ZmM5Mg=='); //la position est la liste commençant à 0
/////////snapshot id est une version de la playlist, la version change quand la modifie, il faut donc renseigner le nouveau snpashot pour les modifs
//removeTracksFromPlaylist('7bIHXyxXbfnpcYCZb2mfT2','spotify:track:38QAnJnnYc1tzDtJnoTZHq');
//
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