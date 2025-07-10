const Song = require('../models/song');
const User = require('../models/db');

// ✅ Upload a new song
exports.uploadsongs = async (req, res) => {
  try {
    const { title, artist } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "File not uploaded" });

    const song = await Song.create({
      title,
      artist,
      fileUrl: file.path,
      uploadedBy: req.user.userId  // ✅ FIXED typo
    });

    res.status(201).json({ message: "File uploaded", song });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all songs
exports.getallsongs = async (req, res) => {
  try {
    const getallsongs = await Song.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 }); // ✅ FIXED sort field

    res.json(getallsongs); // Always returns an array
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch songs' });
  }
};

// ✅ Like or unlike a song
exports.likeOrUnlikeSong = async (req, res) => {
  const userId = req.user.userId;
  const songId = req.params.id;

  try {
    const user = await User.findById(userId);  // ✅ FIXED wrong model
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyLiked = user.likedSongs.includes(songId); // ✅ FIXED logic

    if (alreadyLiked) {
      user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();

    res.json({
      msg: alreadyLiked ? 'Song unliked' : 'Song liked',
      liked: !alreadyLiked
    });

  } catch (err) {
    console.error("Like error:", err.message);
    res.status(500).json({ msg: 'Error while liking/unliking' });
  }
};

// ✅ Get all liked songs
exports.getLikedSongs = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId).populate('likedSongs');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({ likedSongs: user.likedSongs });

  } catch (err) {
    console.error("Liked songs fetch error:", err.message);
    res.status(500).json({ msg: 'Failed to fetch liked songs' });
  }
};
