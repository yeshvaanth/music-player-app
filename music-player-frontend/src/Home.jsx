import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import api from '../api';

import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  IconButton
} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [playingUrl, setPlayingUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get('/songs');
        setSongs(res.data);
        setLoading(false);
      } catch (err) {
        alert('Failed to load songs');
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const toggleLike = async (songId) => {
    try {
      await api.put(`/songs/${songId}/like`);
      const res = await api.get('/songs');
      setSongs(res.data);
    } catch (err) {
      alert('Error liking/unliking song');
    }
  };

  const playAudio = (url) => {
    setPlayingUrl(url === playingUrl ? null : url);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">🎵 Music Feed</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/upload')}
          >
            Upload
          </Button>
        </Box>

        {songs.length === 0 ? (
          <Typography>No songs uploaded yet.</Typography>
        ) : (
          songs.map((song) => (
            <Card key={song._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{song.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {song.artist}
                </Typography>
              </CardContent>

              <CardActions>
                <IconButton onClick={() => playAudio(song.fileUrl)}>
                  {playingUrl === song.fileUrl ? <StopIcon /> : <PlayArrowIcon />}
                </IconButton>

                <IconButton onClick={() => toggleLike(song._id)}>
                  {song.liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
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

export default Home;
