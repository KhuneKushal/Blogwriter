import React, { useState, useEffect, useCallback } from 'react';
import { blogAPI } from '../Services/api';
import './Blogeditor.css';

const BlogEditor = ({ blog, onBack, showToast, onBlogSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        tags: blog.tags ? blog.tags.join(', ') : ''
      });
    }
  }, [blog]);

  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    setAutoSaving(true);
    try {
      const response = await blogAPI.saveDraft({
        id: blog?._id,
        ...formData
      });

      if (!blog && response.data.blog) {
        // Update the blog object with the new ID for future auto-saves
        blog = response.data.blog;
      }

      setHasUnsavedChanges(false);
      showToast('Auto-saved draft', 'success', 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [formData, blog, hasUnsavedChanges, showToast]);

  // Auto-save with debouncing
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      autoSave();
    }, 5000); // Auto-save after 5 seconds of no typing

    return () => clearTimeout(timeoutId);
  }, [formData, hasUnsavedChanges, autoSave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const response = await blogAPI.saveDraft({
        id: blog?._id,
        ...formData
      });

      setHasUnsavedChanges(false);
      showToast('Draft saved successfully');
      onBlogSaved?.(response.data.blog);
    } catch (error) {
      console.error('Error saving draft:', error);
      showToast('Error saving draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Title and content are required for publishing', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await blogAPI.publishBlog({
        id: blog?._id,
        ...formData
      });

      setHasUnsavedChanges(false);
      showToast('Blog published successfully');
      onBlogSaved?.(response.data.blog);
    } catch (error) {
      console.error('Error publishing blog:', error);
      showToast('Error publishing blog', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Blogs
        </button>

        <div className="editor-actions">
          {autoSaving && <span className="auto-save-indicator">Auto-saving...</span>}
          {hasUnsavedChanges && !autoSaving && (
            <span className="unsaved-indicator">Unsaved changes</span>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="btn-secondary"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handlePublish}
            disabled={saving || !formData.title.trim() || !formData.content.trim()}
            className="btn-primary"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your blog title..."
            className="title-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated): react, javascript, coding..."
            className="tags-input"
          />
        </div>

        <div className="form-group">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Start writing your blog content here..."
            className="content-textarea"
            rows="20"
          />
        </div>

        <div className="editor-footer">
          <div className="word-count">
            Words: {getWordCount(formData.content)} | Characters: {formData.content.length}
          </div>

          {blog?.status && (
            <div className={`status-indicator ${blog.status}`}>
              Status: {blog.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
