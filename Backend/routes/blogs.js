const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all blogs for current user
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('author', 'username');
    
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      _id: req.params.id, 
      author: req.user._id 
    }).populate('author', 'username');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save as draft
router.post('/save-draft', auth, async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    let blog;
    if (id) {
      // Update existing blog
      blog = await Blog.findOneAndUpdate(
        { _id: id, author: req.user._id },
        { 
          title: title || 'Untitled',
          content: content || '',
          tags: tagsArray,
          status: 'draft'
        },
        { new: true, upsert: false }
      );
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
    } else {
      // Create new blog
      blog = new Blog({
        title: title || 'Untitled',
        content: content || '',
        tags: tagsArray,
        status: 'draft',
        author: req.user._id
      });
      await blog.save();
    }
    
    res.json({ message: 'Draft saved successfully', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish blog
router.post('/publish', auth, async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    let blog;
    if (id) {
      // Update existing blog
      blog = await Blog.findOneAndUpdate(
        { _id: id, author: req.user._id },
        { 
          title: title.trim(),
          content: content.trim(),
          tags: tagsArray,
          status: 'published'
        },
        { new: true, upsert: false }
      );
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
    } else {
      // Create new blog
      blog = new Blog({
        title: title.trim(),
        content: content.trim(),
        tags: tagsArray,
        status: 'published',
        author: req.user._id
      });
      await blog.save();
    }
    
    res.json({ message: 'Blog published successfully', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ 
      _id: req.params.id, 
      author: req.user._id 
    });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;