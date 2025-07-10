import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Box
} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Navbar from './Navbar';

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [playingUrl, setPlayingUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const res = await api.get('/songs/liked');
        setLikedSongs(res.data.likedSongs || []);
        setLoading(false);
      } catch (err) {
        alert('Failed to fetch liked songs');
        setLoading(false);
      }
    };
    fetchLikedSongs();
  }, []);

  const togglePlay = (url) => {
    setPlayingUrl(playingUrl === url ? null : url);
  };

  const unlikeSong = async (songId) => {
    try {
      await api.put(`/songs/${songId}/like`);
      const res = await api.get('/songs/liked');
      setLikedSongs(res.data.likedSongs || []);
    } catch (err) {
      alert('Error unliking song');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          ❤️ Liked Songs
        </Typography>

        {likedSongs.length === 0 ? (
          <Typography>No liked songs found.</Typography>
        ) : (
          likedSongs.map((song) => (
            <Card key={song._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{song.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {song.artist}
                </Typography>
              </CardContent>

              <CardActions>
                <IconButton onClick={() => togglePlay(song.fileUrl)}>
                  {playingUrl === song.fileUrl ? <StopIcon /> : <PlayArrowIcon />}
                </IconButton>

                <IconButton onClick={() => unlikeSong(song._id)}>
                  <FavoriteIcon color="error" />
                </IconButton>
              </CardActions>

              {playingUrl === song.fileUrl && (
                <audio controls autoPlay style={{ width: '100%' }}>
                  <source src={`http://localhost:5000/${song.fileUrl}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </Card>
          ))
        )}
      </Container>
    </>
  );
};

export default LikedSongs;
