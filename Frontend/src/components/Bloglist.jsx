import React, { useState, useEffect } from 'react';
import { blogAPI } from '../Services/api';
import './Bloglist.css';

const BlogList = ({ onEditBlog, onNewBlog, showToast }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, drafts, published

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAllBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showToast('Error fetching blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogAPI.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
        showToast('Blog deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        showToast('Error deleting blog', 'error');
      }
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'drafts') return blog.status === 'draft';
    if (filter === 'published') return blog.status === 'published';
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h1>My Blogs</h1>
        <button onClick={onNewBlog} className="btn-primary">
          + New Blog
        </button>
      </div>

      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({blogs.length})
        </button>
        <button 
          className={filter === 'drafts' ? 'active' : ''}
          onClick={() => setFilter('drafts')}
        >
          Drafts ({blogs.filter(b => b.status === 'draft').length})
        </button>
        <button 
          className={filter === 'published' ? 'active' : ''}
          onClick={() => setFilter('published')}
        >
          Published ({blogs.filter(b => b.status === 'published').length})
        </button>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="empty-state">
          <h3>No blogs found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't created any blogs yet. Click 'New Blog' to get started!"
              : `You don't have any ${filter} blogs yet.`
            }
          </p>
        </div>
      ) : (
        <div className="blog-grid">
          {filteredBlogs.map(blog => (
            <div key={blog._id} className="blog-card">
              <div className="blog-card-header">
                <h3>{blog.title}</h3>
                <span className={`status-badge ${blog.status}`}>
                  {blog.status}
                </span>
              </div>
              
              <div className="blog-card-content">
                <p>{blog.content.substring(0, 150)}...</p>
              </div>
              
              {blog.tags.length > 0 && (
                <div className="blog-tags">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="blog-card-footer">
                <div className="blog-dates">
                  <small>Created: {formatDate(blog.createdAt)}</small>
                  {blog.updatedAt !== blog.createdAt && (
                    <small>Updated: {formatDate(blog.updatedAt)}</small>
                  )}
                </div>
                
                <div className="blog-actions">
                  <button 
                    onClick={() => onEditBlog(blog)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;