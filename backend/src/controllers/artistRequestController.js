const ArtistRequest = require('../models/ArtistRequest');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createArtistRequest = async (req, res) => {
  try {
    const { stageName, email, phone, bio } = req.body;
    const userId = req.user._id;

    // Kiểm tra request đang pending
    const existingRequest = await ArtistRequest.findOne({ 
      userId, 
      status: 'pending' 
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã có một yêu cầu đang chờ xử lý'
      });
    }

    // Kiểm tra email có khớp với email của user
    if (email !== req.user.email) {
      return res.status(400).json({
        success: false,
        message: 'Email phải trùng với email tài khoản của bạn'
      });
    }

    // Upload ảnh lên Cloudinary
    let profileImageUrl;
    try {
      // Log để debug
      console.log('File info before upload:', {
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images',
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto'
      });

      console.log('Cloudinary upload result:', result);
      
      profileImageUrl = result.secure_url;
      
      // Xóa file tạm sau khi upload thành công
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting temp file:', err);
        } else {
          console.log('Temp file deleted successfully');
        }
      });
    } catch (error) {
      console.error('Detailed Cloudinary error:', error);
      return res.status(400).json({
        success: false,
        message: 'Lỗi khi tải ảnh lên Cloudinary. Vui lòng thử lại.'
      });
    }

    // Tạo artist request mới
    const artistRequest = new ArtistRequest({
      userId,
      stageName,
      email,
      phone,
      bio,
      profileImageUrl
    });

    await artistRequest.save();

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Yêu cầu của bạn đang được xem xét.',
      data: artistRequest
    });

  } catch (error) {
    console.error('Detailed error in createArtistRequest:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.'
    });
  }
};

// Lấy danh sách request cho admin
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ArtistRequest.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Error in getAllRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra khi lấy danh sách yêu cầu'
    });
  }
};

// Approve hoặc reject request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const request = await ArtistRequest.findByIdAndUpdate(
      requestId,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu'
      });
    }

    const statusMessage = status === 'approved' ? 'chấp nhận' : 'từ chối';
    res.status(200).json({
      success: true,
      message: `Yêu cầu đã được ${statusMessage}`,
      data: request
    });

  } catch (error) {
    console.error('Error in updateRequestStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra khi cập nhật trạng thái'
    });
  }
};

// Lấy request của user hiện tại
exports.getUserRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const request = await ArtistRequest.findOne({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error('Error in getUserRequest:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra khi lấy thông tin yêu cầu'
    });
  }
};

// Cập nhật request của user
exports.updateArtistRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { stageName, email, phone, bio } = req.body;
    const userId = req.user._id;

    // Tìm request cần cập nhật
    const existingRequest = await ArtistRequest.findOne({
      _id: requestId,
      userId: userId
    });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu hoặc bạn không có quyền cập nhật'
      });
    }

    // Chỉ cho phép cập nhật nếu request đã bị từ chối
    if (existingRequest.status !== 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể cập nhật yêu cầu đã bị từ chối'
      });
    }

    // Kiểm tra email có khớp với email của user
    if (email !== req.user.email) {
      return res.status(400).json({
        success: false,
        message: 'Email phải trùng với email tài khoản của bạn'
      });
    }

    // Xử lý upload ảnh mới (nếu có)
    let profileImageUrl = existingRequest.profileImageUrl;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_images',
          width: 400,
          height: 400,
          crop: 'fill',
          quality: 'auto'
        });
        
        profileImageUrl = result.secure_url;
        
        // Xóa file tạm sau khi upload thành công
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(400).json({
          success: false,
          message: 'Lỗi khi tải ảnh lên. Vui lòng thử lại.'
        });
      }
    }

    // Cập nhật request
    const updatedRequest = await ArtistRequest.findByIdAndUpdate(
      requestId,
      {
        stageName,
        email,
        phone,
        bio,
        profileImageUrl,
        status: 'pending', // Reset status về pending
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật yêu cầu thành công! Yêu cầu của bạn đang được xem xét lại.',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Error in updateArtistRequest:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra khi cập nhật yêu cầu'
    });
  }
}; 