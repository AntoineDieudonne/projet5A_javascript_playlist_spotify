# Projet javascript Joly Dylan, Macadré Clément, Gomond Ronan

## Init
Pour créer l'application, on utilise l'api en mode développeur, il faut donc ajouter l'email du compte spotify qui utilise l'appli (dans le dashbord spotify for dev)
On lance ensuite le serveur JavaScript "index.js" avec la commande node index.js
L'application est disponnible en local sur le port 8888 --> http://localhost:8888

[[_TOC_]]

## Documentation du code sur le front

### Les règles sur l'affichage de toutes les pages sont dans le fichier [style.css](style.css)

### Pour plus de clarté dans le code, les IDs et classes sont espacés avec des - (tirets du milieu)

### Sur la page [index.html](index.html)

- C'est la première page qui est affichée lorqu'on accède au site.
- Elle contient un message d'accueil et un bouton pour se connecter à l'application.
- Pour l'utiliser, il faut un compte spotify, c'est pourquoi le bouton amène dans un premier temps vers une page de connexion à spotify.
- Pour la première utilisation, l'application va demander l'accès à certaines informations du compte nécessaires à notre application :
	- Les informations de l'utilisateur
	- L'accès en lecture et en écriture aux playlists de l'utilisateur
	- L'accès en lecture et en écriture aux musiques suivies par l'utilisateur
	- Les écoutes récentes
	- Les musiques les plus écoutées
- Grâce à cette connexion, on va récupérer les tokens (accesstoken et refreshtoken) qui vont permettre les appels à l'API de Spotify
- ✔️ Ensuite, on est redirigé vers la page [menu.html](menu.html)


### Sur la page [menu.html](menu.html)

- Il y a la présence d'un bouton redirigeant vers la page [playlist.html](playlist.html) pour créer une playlist vide, mais on peut aussi éditer une playlist existante parmi celles existantes affichées plus bas sur cette page.
- Le code JS contient une fonction addList qui ajoute une playlist à l'interface graphique. Les arguments sont les suivants :
	- id : L'identifiant unique permettant à Spotify de retrouver la playlist
	- imgSrc : L'image qui représente la playlist
	- nom : le nom de la playlist
-La création d'une playlist demande un nom qui est transmit aux pages suivantes dans le LocalStorage du navigateur

- :x: **Pas encore faite** :x: Pour pouvoir modifier une playlist lorsqu'on clique dessus, la fonction est définie directement dans la fonction `addList` à l'appel de `.click(function{...})` pour l'instant elle ne fait qu'afficher l'ID de la playlist mais à l'avenir elle devra rediriger vers la page [playlist.html](playlist.html) pour pouvoir modifier librement le playlist déjà existante.

- une fonction automatisant l'appel à `addList` est `onNewPlaylists(list)`. Elle peut prendre en argument une liste de listes ou bien cette liste au format string avec des **double guillements** pour marquer la présence d'un string (des simples guillemets ne sont pas acceptés).

#### Démonstration d'ajout de playlists

```js
// With a JavaScript object directly
let lists = [['Punk rock','mauvais-garcon','Pictures/lctc.jpg'],
            ['Synthwave','jours-dangereux','Pictures/dangerousd.jpg']];
onNewPlaylists(lists);
// Works with a JSON string too !
onNewPlaylists('[["Grunge","kurt-cobain","Pictures/nvm.jpg"],["Progressive rock","flammand-rose","Pictures/animals.jpg"]]');
```

### Sur la page [playlist.html](playlist.html)

- C'est la page principale de l'application.
- La partie supérieure de la page permet de rechercher des chansons par leur titre, artiste et appartenance à une playlist. 
Le volet supérieur permet aussi de choisir dans quelle playlist chercher les playlists à ajouter à celle en cours de création.
On peut aussi supprimer une playlist.

- La partie inférieure est composée de 2 zones : une première à gauche représentant la banque de sons à ajouter et l'autre à gauche, la playlist en cours de création.

#### Les fonctions sur la partie supérieure sont encore en cours d'implémentation

Les fonctions permettant l'ajout dynamique d'options à une balise select sont :
- `addSongBank(value, displayedName)`
- `addEditablePlaylist(value, dispalyedName)`
	- value est le nom de la playlist sur l'API
	- displayedName est le nom de la playlist à afficher

#### Les fonctions utilisées par la partie inféieure sont nombreuses

:x: **Si une** :x: **est présente, cela signifie qu'une liaison est à mettre en place avec l'API** :x:

- `updateDrag()` qui met à jour les éléments qui peuvent bouger, que ce soit de manière verticale pour changer l'ordre des chansons ou sur toute la page pour ajouter des chansons. Doit être appelée à chaque modification d'une playlist pour s'assurer que l'élément peut être bougé.
- Lors du drop d'une div, l'événement est traité et redirigé vers une des deux fonctions :
	- :x: `switchIndex(ui, zone)` qui gère le changement de l'ordre d'une chanson dans la playlist
	- :x: `cloneImage(ui, zone, id)` qui gère l'ajout d'une chanson à la nouvelle playlist

La création d'une div contenant les infos est gérée par un builder

- La création du builder doit se faire avec un minimum d'arguments de cette manière `SongBuilder(id, div, imgSrc, title, artist)` où les arguments nécessaires à l'affichage d'une chanson sont :
	- id : L'identifiant de la chanson
	- div : L'id de la zone où on veut ajouter la chanson
	- imgSrc : La source (URL) de l'image de la chanson à afficher
	- title : Le titre de la chanson
	- artist : L'artiste
- Les options possibles pour le builder sont :
	- `canBePlayed(url)` si on peut écouter la musique, l'URL nécessaire pour la lecture sera stockée dans l'id de la balise
	- `canBeDeleted()` si on veut pouvoir supprimer la musique
	- `canMoveVertically()` si on veut activer le déplacement vertical de l'objet
	- `insertBefore(id)` pour insérer la chanson devant une autre chanson, il faut mettre l'id de la chanson en argument
- Finalement pour afficher la chanson, il faut appeler la méthode `build()`.

exemples :
```js
// Doing it in one line
new SongBuilder(id, zone, imgSrc, title, artist).canMoveVertically().canBeDeleted().canBePlayed(url).build();
// Doing it in multiple lines
// The order in which the options are added doesn't matter
let builder = new SongBuilder(id, zone, imgSrc, title, artist);
builder.canBeDeleted();
builder.canBePlayed(url);
builder.canMoveVertically();
builder.build();
```

- `onNewSongs(listOfSongs)` qui prend en argument la liste de chansons envoyées par le serveur pour les afficher. Fonctionne de la même manière que [onNewPlaylists(lists)](#démonstration-dajout-de-playlists)

- :x: `deleteSong(e)` supprime une chanson de la playlist
- `playSong(div)` Joue une musique ou un extrait de celle-ci

- :x: La fonction `addSong(...)` est obsolète et ne sert que pour l'initialisation manuelle de la page, il faudra supprimer cette fonction aisni que tous les appels d'initailisation en dessous une fois la communication avec l'API mise en place.

Have fun ! :+1:

## Documentation de l'api Yfitops

Cette partie du projet s'occupe d'interroger la base de données Spotify pour récupérer des informations sur des titres issus de playlists ou de titres joués récemment.

#### ✔️ Prérequis :

Il faut créer une application spotify dans son dashboard sur **Spotify for devloppers** : https://developer.spotify.com/dashboard.
On va ensuite récupérer deux informations essentielles pour la communication avec l'API, le **ClientID** et le **ClientSecret**.
Il faut aussi renseigner dans les paramètres l'**URI de redirection**, qui est dans notre cas : http://localhost:8888/callback.

De plus, nous avons utiliser le JavaScript avec notamment **Nodejs** et la commande "node index.js" pour lancer notre server.
Nous avons utilisé les modules suivants :
	-require('spotify-web-api-node');
	-require("express");
	-require("path");
	-require('fs')

#### ✔️ Accès aux chansons joués récement :
```html
http://localhost:8888/getPresentationRecentPlayed/?amount=amount_of_songs

Exemple : http://localhost:8888/getPresentationRecentPlayed/?amount=10
```
Cette adresse fournit un tableau type `chanson` de taille n lignes par 6 colonnes répertoriant les informations de n chansons.
Chaque ligne contient dans l'ordre suivant :
- Le nom de la chanson
- Le nom de l'artiste
- La durée du morceau
- L'image associée au titre
- S'il est disponible, un lien vers une écoute de 30 secondes
- L'uri de la chanson
Dans l'exemple founrnit, n = 10 (n = 20 par défaut, limite = 50).

#### ✔️ Accès aux chansons likés :
```html
http://localhost:8888/getMySavedTracks/?amount=amount_of_songs

Exemple : http://localhost:8888/getMySavedTracks/?amount=10
```
Le tableau retourné a la même structure que le tableau type `chanson`.
Dans l'exemple founrnit, n = 10 (n = 20 par défaut, limite = 50).

#### ✔️ Accéder aux noms de playlists et à leurs identifiants :
```html
http://localhost:8888/getUserPlaylists
```
Cette commande fournit un tableau type `playlist` de taille n lignes par 3 colonnes répertoriant les informations de n playlists.
Chaque ligne contient dans l'ordre suivant :
- Le nom de la playlist
- L'identifiant de la playlist
- L'image associée à la playlist

#### ✔️ Accès au contenu d'une playlist existante à l'aide de son identifiant :
```html
http://localhost:8888/getPresentationSongsPlaylist/?id=id_playlist

Exemple : http://localhost:8888/getPresentationSongsPlaylist/?id=1RhhvhdE7Kro3HN6lL5Sje
```
Le tableau retourné a la même structure que le tableau type `chanson`.

#### ✔️ Effectuer une recherche d'un titre, d'une playlist ou d'un album à partir d'un mot clé :
```html
http://localhost:8888/search/?type=titre_playlist_artist?keyword=mots_clés

Exemple : http://localhost:8888/search/?type=titre&keyword=hotel_california
http://localhost:8888/search/?type=playlist&keyword=street_cred
http://localhost:8888/search/?type=artiste&keyword=iron_maiden
```
La commande retourne un tableau de type `chanson`.
Avec `?type=titre`,  le tableau contient les chansons les plus populaires en rapport avec les mots_clés renseignés.
Avec `?type=playlist`, le tableau retourne les chansons de la première playlist en rapport avec les mots_clés renseignés.
Avec `?type=artiste`, le tableau retourne les chansons les plus populaires de l'artiste le plus populaire en rapport avec les mots_clés renseignés.

#### ✔️ Effectuer une recherche d'une playlist à partir d'un mot clé :
```html
http://localhost:8888/searchPlaylistsPresentation/?keyword=mots_clés

Exemple : http://localhost:8888/searchPlaylistsPresentation/?keyword=street_cred
```
Le tableau retourné a la même structure que le tableau type `playlist`.

#### ✔️ Effectuer une recherche d'un artiste à partir d'un mot clé :
```html
http://localhost:8888/searchArtistsPresentation/?keyword=mots_clés

Exemple : http://localhost:8888/searchArtistsPresentation/?keyword=iron_maiden
```
Cette commande fournit un tableau type `artist` de taille n lignes par 3 colonnes répertoriant les informations de n artistes.
Chaque ligne contient dans l'ordre suivant :
- Le nom de l'artiste
- L'identifiant de l'artiste
- L'image associée à l'artiste

#### ✔️ Ajouter une ou plusieurs chanson(s) à une playlist :
```html
http://localhost:8888/addTracksToPlaylist/?id=id_playlist&uri=uri.spotify.song1_uri.spotify.song2

Exemple : http://localhost:8888/addTracksToPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS&uri=spotify:track:3dyoo6UNb2VlMTISBqrDb1_spotify:track:4yE3KKg74Oy4ZwBLTDtlxo
```
Les URI des chansons doivent être séparé par un `_`.
L'API gère les doublons et ne les rajoutes pas à la playlist.

#### ✔️ Ajouter une ou plusieurs chanson(s) à une position spécifique dans une playlist :
```html
http://localhost:8888/addTracksToPlaylistInPos/?id=id_playlist&uri=uri.spotify.song1_uri.spotify.song2&pos=position

Exemple : http://localhost:8888/addTracksToPlaylistInPos/?id=1Dm4Nr0mpgCAqJPzcfs5vS&uri=spotify:track:0OF6WSdeVmYEGBZlxvwvLq_spotify:track:2HzJCYwtTXqrj72mE2hnEW&pos=1
```
Mêmes remarques que la commande précédente. 
La positon 0 correspond au début de la playlist.
L'API ajoutera les chansons au début de la playlist si la position renseignée n'existe pas.

#### ✔️ Changer une chanson d'emplacement dans une playlist :
```html
http://localhost:8888/reorderTrackInPlaylist/?id=id_playlist&posStart=position_de_départ&posEnd=position_d'arrivée

Exemple : http://localhost:8888/reorderTrackInPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS&posStart=0&posEnd=2
```
L'exemple ci-dessus placera la première chanson à la seconde position dans la playlist.
Pour placer la deuxième chanson à la troisième position il faudra renseigner posStart=1 et posEnd=3.

#### ✔️ Supprimer une chanson d'une playlist :
```html
http://localhost:8888/removeTrackFromPlaylist/?id=id_playlist&uri=uri.spotify.song

Exemple : http://localhost:8888/removeTrackFromPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS&uri=spotify:track:3dyoo6UNb2VlMTISBqrDb1
```
On ne peut supprimer qu'une chanson à la fois, mais tout doublon dans la playlist sera aussi supprimé. 

#### ✔️ Créer une playlist :
```html
http://localhost:8888/newPlaylist/?nomPlaylist=nom_playlist

Exemple : http://localhost:8888/newPlaylist/?nomPlaylist=Pléliste_test
```

#### ✔️ S'abonner à une playlist :
```html
http://localhost:8888/followPlaylist/?id=id_playlist

Exemple : http://localhost:8888/followPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS
```

#### ✔️ Se désabonner d'une playlist :
```html
http://localhost:8888/unfollowPlaylist/?id=id_playlist

Exemple : http://localhost:8888/unfollowPlaylist/?id=1Dm4Nr0mpgCAqJPzcfs5vS
```

## Génération de playlist à l'aide de l'api Spotify

### Développement d'une interface graphique permettant de créer des playlists à partir d'une session d'écoute de groupe.

Les participants se connectent avec leurs comptes Spotify via l'api Spotify pour que l'application ait accès à leurs activités.
Un historique des musiques jouées est créé pendant cette session de groupe.
Les utilisateurs peuvent ensuite sélectionner les musiques qui leur ont plu et les ajouter à un panier.
À partir de ce panier, les utilisateurs peuvent ajouter les musiques à différentes playlists personnelles.

### L'appli devra :
- Interroger la base de données Spotify pour récupérer des informations sur les titres joués
- Sauvegarder dans un Json ou une base de données les informations nécessaires
- Afficher de manière intuitive ces informations sur une page web.

### Détails :
- Les interactions se feront à base de glisser-déposer.
- Création d'un dépôt git pour favoriser le versionning et la coopération
