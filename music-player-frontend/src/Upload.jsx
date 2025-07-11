import React, { useState } from 'react';
import api from '../api';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputLabel
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Navbar from './Navbar';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a song file');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('song', file);

    try {
      await api.post('/songs/uploads', formData);
      alert('Song uploaded successfully');
      setTitle('');
      setArtist('');
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Upload Song</Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            margin="normal"
            required
          />

          <Box mt={2}>
            <InputLabel>Upload File</InputLabel>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ marginTop: '0.5rem' }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 3 }}
          >
            Upload
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Upload;
