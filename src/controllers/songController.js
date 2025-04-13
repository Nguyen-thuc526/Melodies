const Song = require('../models/Song');
const cloudinary = require('../config/cloudinary');
const { uploadAudio, uploadImage } = require('../services/cloudinaryService');

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: folder,
            resource_type: 'auto',
        });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Error uploading to Cloudinary: ${error.message}`);
    }
};

// Get all songs with filters and pagination
exports.getAllSongs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const genre = req.query.genre;
        const search = req.query.search;
        const sort = req.query.sort || '-createdAt';

        let query = {};

        // Apply filters
        if (genre) {
            query.genre = genre;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Execute query with pagination
        const songs = await Song.find(query)
            .populate('artist', 'username')
            .populate('album', 'title')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count for pagination
        const total = await Song.countDocuments(query);

        res.json({
            success: true,
            data: songs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get single song
exports.getSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id)
            .populate('artist', 'username')
            .populate('album', 'title')
            .populate('comments.user', 'username');

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found',
            });
        }

        // Increment play count
        song.plays += 1;
        await song.save();

        res.json({
            success: true,
            data: song,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Test upload song
exports.testUploadSong = async (req, res) => {
    try {
        console.log('Files received:', req.files);
        console.log('Body received:', req.body);

        if (!req.files || !req.files.audioFile || !req.files.coverImage) {
            return res.status(400).json({ 
                success: false,
                message: 'Please upload both audio and cover image files' 
            });
        }

        // Log file details
        console.log('Audio file:', {
            name: req.files.audioFile.name,
            size: req.files.audioFile.size,
            mimetype: req.files.audioFile.mimetype
        });

        console.log('Cover image:', {
            name: req.files.coverImage.name,
            size: req.files.coverImage.size,
            mimetype: req.files.coverImage.mimetype
        });

        // Upload files to Cloudinary
        const audioUrl = await uploadAudio(req.files.audioFile);
        const coverImageUrl = await uploadImage(req.files.coverImage);

        // Create song
        const song = await Song.create({
            title: req.body.title,
            artist: req.user._id,
            genre: req.body.genre,
            description: req.body.description,
            audioUrl,
            coverImageUrl
        });

        res.status(201).json({
            success: true,
            data: song
        });
    } catch (error) {
        console.error('Error in test upload:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new song
exports.createSong = async (req, res) => {
    try {
        console.log('Files received:', req.files);
        console.log('Body received:', req.body);

        if (!req.files || !req.files.audioFile || !req.files.coverImage) {
            return res.status(400).json({ 
                success: false,
                message: 'Please upload both audio and cover image files' 
            });
        }

        // Validate required fields
        if (!req.body.title || !req.body.genre || !req.body.duration) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, genre and duration'
            });
        }

        // Upload files to Cloudinary
        const audioUrl = await uploadAudio(req.files.audioFile);
        const coverImageUrl = await uploadImage(req.files.coverImage);

        // Create song
        const song = await Song.create({
            title: req.body.title,
            artist: req.user._id,
            genre: req.body.genre, // This should be a valid Genre ObjectId
            duration: req.body.duration,
            audioUrl,
            coverImage: coverImageUrl,
            description: req.body.description
        });

        res.status(201).json({
            success: true,
            data: song
        });
    } catch (error) {
        console.error('Error in createSong:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update song
exports.updateSong = async (req, res) => {
    try {
        let song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        // Check ownership
        if (song.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this song'
            });
        }

        // Handle file uploads if any
        if (req.files) {
            if (req.files.audioFile) {
                song.audioUrl = await uploadAudio(req.files.audioFile);
            }
            if (req.files.coverImage) {
                song.coverImageUrl = await uploadImage(req.files.coverImage);
            }
        }

        // Update other fields
        song = await Song.findByIdAndUpdate(
            req.params.id,
            { ...req.body, ...song },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: song
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete song
exports.deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        // Check ownership
        if (song.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this song'
            });
        }

        await song.remove();

        res.status(200).json({
            success: true,
            message: 'Song deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Toggle like
exports.toggleLike = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        // Check if user already liked the song
        const index = song.likes.indexOf(req.user._id);
        if (index === -1) {
            song.likes.push(req.user._id);
        } else {
            song.likes.splice(index, 1);
        }

        await song.save();

        res.status(200).json({
            success: true,
            data: song
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add comment
exports.addComment = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        const comment = {
            user: req.user._id,
            text: req.body.text
        };

        song.comments.push(comment);
        await song.save();

        res.status(201).json({
            success: true,
            data: song
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get trending songs
exports.getTrendingSongs = async (req, res) => {
    try {
        const songs = await Song.find()
            .populate('artist', 'username')
            .sort('-likes -createdAt')
            .limit(10);

        res.status(200).json({
            success: true,
            data: songs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
