import { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../constants/initialData';

export default function IssueForm({ onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Facilities & Maintenance',
    priority: 'Medium',
    location: '',
    submitterName: '',
    submitterEmail: '',
    submitterId: '',
    description: '',
    attachmentUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a descriptive issue title.';
    } else if (formData.title.trim().length < 6) {
      newErrors.title = 'Title must be at least 6 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please specify the campus location (building, room, or landmark).';
    }

    if (!formData.submitterName.trim()) {
      newErrors.submitterName = 'Please provide your full name.';
    }

    if (!formData.submitterEmail.trim()) {
      newErrors.submitterEmail = 'Please provide your campus email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
      newErrors.submitterEmail = 'Please provide a valid email format (e.g. name@campus.edu).';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the problem so technicians can address it.';
    } else if (formData.description.trim().length < 15) {
      newErrors.description = 'Please provide a little more detail (at least 15 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePrioritySelect = (priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, attachmentUrl: 'Only image files are allowed.' }));
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, attachmentUrl: 'Image size should be under 3MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, attachmentUrl: event.target.result }));
      setErrors((prev) => ({ ...prev, attachmentUrl: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, attachmentUrl: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = onSubmitSuccess(formData);
      setIsSubmitting(false);
      setSubmittedTicket(result);
    }, 400);
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      category: 'Facilities & Maintenance',
      priority: 'Medium',
      location: '',
      submitterName: '',
      submitterEmail: '',
      submitterId: '',
      description: '',
      attachmentUrl: ''
    });
    setErrors({});
    setSubmittedTicket(null);
  };

  // If successfully submitted, show the success confirmation card
  if (submittedTicket) {
    return (
      <div className="card success-card">
        <div className="success-icon-wrap">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Helpdesk Ticket Submitted!</h2>
        <p className="success-subtitle">
          Your issue has been logged into the campus system with status <strong>Pending</strong>.
        </p>

        <div className="ticket-id-badge-wrap">
          <span className="ticket-id-label">Your Tracking Ticket ID:</span>
          <span className="ticket-id-code">{submittedTicket.id}</span>
        </div>

        <div className="submitted-summary">
          <div className="summary-row">
            <span className="summary-lbl">Issue:</span>
            <span className="summary-val">{submittedTicket.title}</span>
          </div>
          <div className="summary-row">
            <span className="summary-lbl">Category:</span>
            <span className="summary-val">{submittedTicket.category}</span>
          </div>
          <div className="summary-row">
            <span className="summary-lbl">Location:</span>
            <span className="summary-val">{submittedTicket.location}</span>
          </div>
          <div className="summary-row">
            <span className="summary-lbl">Priority:</span>
            <span className="summary-val">{submittedTicket.priority}</span>
          </div>
        </div>

        <p className="notification-hint">
          A confirmation and tracking updates will be addressed by campus facilities. You can track this ticket on the Campus Issue Board at any time.
        </p>

        <div className="success-actions">
          <button className="btn btn-primary" onClick={handleResetForm}>
            Submit Another Issue
          </button>
          <button className="btn btn-secondary" onClick={() => onCancel && onCancel()}>
            View Campus Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card form-card">
      <div className="form-header">
        <div className="form-header-badge">Submit Helpdesk Ticket</div>
        <h2>Report a Campus Issue</h2>
        <p className="form-description">
          Need maintenance, Wi-Fi assistance, or classroom equipment repairs? Fill out the details below to notify campus staff.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Issue Title <span className="required">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g. Water dripping from ceiling AC in Science Hall 204"
            value={formData.title}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <span id="title-error" className="error-message" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        {/* Category & Location */}
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              className={`form-select ${errors.category ? 'input-error' : ''}`}
              value={formData.category}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span id="category-error" className="error-message" role="alert">
                {errors.category}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location / Room <span className="required">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className={`form-input ${errors.location ? 'input-error' : ''}`}
              placeholder="e.g. Library 3rd Floor / Hostel 2 Room 104"
              value={formData.location}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? 'location-error' : undefined}
            />
            {errors.location && (
              <span id="location-error" className="error-message" role="alert">
                {errors.location}
              </span>
            )}
          </div>
        </div>

        {/* Priority Selector */}
        <div className="form-group">
          <label id="priority-label" className="form-label">
            Priority Level <span className="required">*</span>
          </label>
          <div
            className="priority-selector"
            role="radiogroup"
            aria-labelledby="priority-label"
          >
            {PRIORITIES.map((p) => {
              const isSelected = formData.priority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`priority-option ${isSelected ? 'selected' : ''} priority-opt-${p.value.toLowerCase()}`}
                  onClick={() => handlePrioritySelect(p.value)}
                >
                  <span className="priority-opt-dot"></span>
                  <span className="priority-opt-label">{p.label}</span>
                </button>
              );
            })}
          </div>
          <span className="input-hint">Select &quot;Urgent&quot; only for safety hazards, active water leaks, or electrical concerns.</span>
        </div>

        {/* Submitter Info */}
        <div className="form-row-3">
          <div className="form-group">
            <label htmlFor="submitterName" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="submitterName"
              name="submitterName"
              type="text"
              className={`form-input ${errors.submitterName ? 'input-error' : ''}`}
              placeholder="e.g. Maya Lin"
              value={formData.submitterName}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={Boolean(errors.submitterName)}
              aria-describedby={errors.submitterName ? 'submitterName-error' : undefined}
            />
            {errors.submitterName && (
              <span id="submitterName-error" className="error-message" role="alert">
                {errors.submitterName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="submitterEmail" className="form-label">
              Campus Email <span className="required">*</span>
            </label>
            <input
              id="submitterEmail"
              name="submitterEmail"
              type="email"
              className={`form-input ${errors.submitterEmail ? 'input-error' : ''}`}
              placeholder="name@campus.edu"
              value={formData.submitterEmail}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={Boolean(errors.submitterEmail)}
              aria-describedby={errors.submitterEmail ? 'submitterEmail-error' : undefined}
            />
            {errors.submitterEmail && (
              <span id="submitterEmail-error" className="error-message" role="alert">
                {errors.submitterEmail}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="submitterId" className="form-label">
              Student / Staff ID <span className="optional">(Optional)</span>
            </label>
            <input
              id="submitterId"
              name="submitterId"
              type="text"
              className="form-input"
              placeholder="e.g. STU-2024-9102"
              value={formData.submitterId}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Detailed Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Detailed Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            placeholder="Please describe the issue in detail, when it began, and any relevant steps..."
            value={formData.description}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'description-error' : undefined}
          ></textarea>
          {errors.description && (
            <span id="description-error" className="error-message" role="alert">
              {errors.description}
            </span>
          )}
        </div>

        {/* Attachment upload */}
        <div className="form-group">
          <label className="form-label">
            Photo Attachment <span className="optional">(Optional - max 3MB)</span>
          </label>
          {formData.attachmentUrl ? (
            <div className="image-preview-container">
              <img src={formData.attachmentUrl} alt="Issue preview" className="image-preview-img" />
              <button type="button" className="btn btn-sm btn-danger remove-img-btn" onClick={handleRemoveImage}>
                Remove Photo
              </button>
            </div>
          ) : (
            <div className="file-upload-box">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input-hidden"
                aria-invalid={Boolean(errors.attachmentUrl)}
                aria-describedby={errors.attachmentUrl ? 'attachmentUrl-error' : undefined}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>Click to attach a photo or drag image here</span>
                <span className="file-subtext">Supports PNG, JPG, WEBP</span>
              </label>
            </div>
          )}
          {errors.attachmentUrl && (
            <span id="attachmentUrl-error" className="error-message" role="alert">
              {errors.attachmentUrl}
            </span>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Submitting...
              </>
            ) : (
              'Submit Helpdesk Ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
