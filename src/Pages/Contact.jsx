import React, { useState } from "react";
import "./Contact.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    topic: "",
    comment: "",
    acceptedTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-container" >
      <h3 className="contact-subheading">Get in touch</h3>
      <h1 className="contact-heading">CONTACT US</h1>

      <div className="contact-content">
        <div className="contact-left">
          <h2>We are here to serve!<br/>How can we help you?</h2>
          <p>
            If you have any questions about your submission, directory, billing,
            courses, or anything else related, we’re here to help!
          </p>
        </div>

        <div className="contact-form-container">
          {submitted ? (
            <div className="success-message">
              <h3>Thank you for reaching out!</h3>
              <p>We will get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name (*)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>E-mail (*)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="text"
                  name="website"
                  placeholder="Add a URL with http://"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>What's Up? (*)</label>
                <select name="topic" value={formData.topic} onChange={handleChange} required>
                  <option value="">-- Select an option --</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comment (*)</label>
                <textarea
                  name="comment"
                  rows="4"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                />
                </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  required
                />
                <label>
                  I have read and accepted the <a href="terms">Terms and Conditions</a> and <a href="privacy">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="submit-btn">SEND MESSAGE</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
