const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Photo Schema
const photoSchema = new mongoose.Schema({
  friendName: String,
  imageUrl: String,
  uploadedAt: { type: Date, default: Date.now }
});
const Photo = mongoose.model('Photo', photoSchema);

// Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'friends_photos' }
});
const upload = multer({ storage: storage });

// Route to Upload Photo
app.post('/upload', upload.single('image'), async (req, res) => {
  const newPhoto = new Photo({
    friendName: req.body.name,
    imageUrl: req.file.path
  });
  await newPhoto.save();
  res.send('Photo uploaded successfully!');
});

// Route to Get All Photos
app.get('/photos', async (req, res) => {
  const photos = await Photo.find();
  res.json(photos);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')));
