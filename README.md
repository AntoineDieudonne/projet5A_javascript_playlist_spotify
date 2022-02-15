# Projet javascript Joly Dylan, Macadré Clément, Gomond Ronan

## Init
Pour créer l'application, on utilise l'api en mode développeur, il faut donc ajouter l'email du compte spotify qui utilise l'appli (dans le dashbord spotify for dev)


## Documentation du code sur le front

### Les règles sur l'affichage de toutes les pages sont dans le fichier [style.css](style.css)

### Pour plus de clarté dans le code, les IDs et classes sont espacés avec des - (tirets du milieu)

### Sur la page [index.html](index.html)

- C'est la première page qui est affichée lorqu'on accède au site.
- Elle contient uniquement un bouton pour se connecter à un compte spotify et accéder aux fonctionnalités de l'application.

:x: Reste à rediriger vers la page [menu.html](menu.html) une fois connecté :x:

### Sur la page [menu.html](menu.html)

- Il y a la présence d'un bouton redirigeant vers la page [playlist.html](playlist.html) pour créer une playlist vide, mais on peut aussi éditer une playlist existante parmi celles existantes affichées plus bas sur cette page.
- Le code JS contient uniquement une fonction addList qui ajoute une playlist à l'interface graphique. Les arguments sont les suivants :
	- id : L'identifiant unique permettant à Spotify de retrouver la playlist
	- imgSrc : L'image qui représente la playlist
	- nom : le nom de la playlist
- :x: **Pas encore faite** :x: Pour pouvoir modifier une playlist lorsqu'on clique dessus, la fonction est définie directement dans la fonction `addList` à l'appel de `.click(function{...})` pour l'instant elle ne fait qu'afficher l'ID de la playlist mais à l'avenir elle devra rediriger vers la page [playlist.html](playlist.html) pour pouvoir modifier librement le playlist déjà existante.

### Sur la page [playlist.html](playlist.html)

- C'est la page principale de l'application.
- :x: **Pas encore faite** :x: La partie supérieure de la page permet de rechercher des chansons, ou encore de choisir dans quelle playlist chercher les playlists à ajouter à celle en cours de création.

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

##### La création d'une div contenant les infos est gérée par un builder

- La création du builder doit se faire avec un minimum d'arguments de cette manière `SongBuilder(id, div, imgSrc, title, artist)` où les arguments nécessaires à l'affichage d'une chanson sont :
	- id : L'identifiant de la chanson
	- div : L'id de la zone où on veut ajouter la chanson
	- imgSrc : La source (URL) de l'image de la chanson à afficher
	- title : Le titre de la chanson
	- artist : L'artiste
- Les options possibles pour le builder sont :
	- `canBePlayed()` si on peut écouter la musique
	- `canBeDeleted()` si on veut pouvoir supprimer la musique
	- `canMoveVertically()` si on veut activer le déplacement vertical de l'objet
	- `insertBefore(id)` pour insérer la chanson devant une autre chanson, il faut mettre l'id de la chanson en argument
- Finalement pour afficher la chanson, il faut appeler la méthode `build()`.

exemples :
```js
// Doing it in one line
new SongBuilder(id, zone, imgSrc, title, artist).canMoveVertically().canBeDeleted().canBePlayed().build();
// Doing it in multiple lines
// The order in which the options are added doesn't matter
let builder = new SongBuilder(id, zone, imgSrc, title, artist);
builder.canBeDeleted();
builder.canBePlayed();
builder.canMoveVertically();
builder.build();
```

- :x: `deleteSong(e)` supprime une chanson de la playlist
- :x: `playSong(id)` Joue une musique ou un extrait de celle-ci

- La fonction `addSong(...)` est obsolète et ne sert que pour l'initialisation manuelle de la page, il faudra supprimer cette fonction aisni que tous les appels d'initailisation en dessous une fois la communication avec l'API mise en place.

Have fun ! :+1:

## Documentation du code sur le back

Cette partie du projet s'occupe d'interroger la base de données Spotify pour récupérer des informations sur des titres issus de playlists ou de titres joués récemment.

Accès aux chansons joués récement :
```js
let data = getPresentationRecentPlayed()
data.then(function(result) {
  console.log(result)
})
```
Cette commande fournit un tableau type `chanson` de taille n lignes par 5 colonnes répertoriant les informations de n chansons.
Chaque ligne contient dans l'ordre suivant :
- Le nom de la chanson
- Le nom de l'artiste
- La durée du morceau
- L'image associée au titre
- S'il est disponible, un lien vers une écoute de 30 secondes

Accès au contenu d'une playlist existante à l'aide de son identifiant :
```js
let data = getPresentationSongsPlaylist(idPlaylist)
data.then(function(result) {
  console.log(result)
})
```
Le tableau retourné a la même structure que le tableau type `chanson`.

Effectuer une recherche d'un titre à partir d'un mot clé :
```js
let data = searchTracksPresentation("hotel california")
data.then(function(result) {
  console.log(result)
})
```
Le tableau retourné a la même structure que le tableau type `chanson`.

Accéder aux noms de playlists et à leurs identifiants :
```js
let data = getUserPlaylists(getMyID())
data.then(function(result) {
  console.log(result)
})
```
Cette commande fournit un tableau type `playlist` de taille n lignes par 3 colonnes répertoriant les informations de n playlists.
Chaque ligne contient dans l'ordre suivant :
- Le nom de la playlist
- L'identifiant de la playlist
- L'image associé à la playlist

Effectuer une recherche d'une playlist à partir d'un mot clé :
```js
let data = searchPlaylistsPresentation("street cred")
data.then(function(result) {
  console.log(result)
})
```
Le tableau retourné a la même structure que le tableau type `playlist`.

Effectuer une recherche d'un artiste à partir d'un mot clé :
```js
let data = searchArtistsPresentation("Dio")
data.then(function(result) {
  console.log(result)
})
```
Cette commande fournit un tableau type `artist` de taille n lignes par 3 colonnes répertoriant les informations de n artistes.
Chaque ligne contient dans l'ordre suivant :
- Le nom de l'artiste
- L'identifiant de l'artiste
- L'image associé à l'artiste

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
