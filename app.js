require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('hbs');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:
app.get("/",function(req,res,next){
    res.render('home')
})

app.get("/artist-search",function(req,res,next){
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items[0]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const doto={artists:data.body.artists.items}
     res.render('artist-search-results',doto)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
     spotifyApi
     .getArtistAlbums(req.params.artistId)
     .then(data=>{
        console.log('The received data from the API: ', data.body)
        const albums={albums:data.body.items}
        res.render('albums',albums)
     })
     .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data=>{
       console.log('The received data from the API: ', data.body.items)
       const tracks={tracks:data.body.items}
       res.render('tracks',tracks)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
 });

  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
