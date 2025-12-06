import React from 'react';
import './Home.css'; // Import CSS for styling

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Legal Marketplace</h1>
        <p>Your one-stop platform for all your legal service needs</p>
        <a href="/listings" className="btn-primary">Browse Listings</a>
      </header>
      <section className="home-features">
        <div className="feature-item">
          <h2>Expert Lawyers</h2>
          <p>Connect with trusted legal professionals for consultations and more.</p>
        </div>
        <div className="feature-item">
          <h2>Secure Document Management</h2>
          <p>Upload and manage your legal documents with full confidentiality.</p>
        </div>
        <div className="feature-item">
          <h2>Easy Scheduling</h2>
          <p>Book consultations and track appointments with ease.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
