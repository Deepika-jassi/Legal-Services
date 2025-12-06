import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Listings.css";

const SAMPLE_LISTINGS = [
  {
    id: 1,
    title: "Contract Drafting",
    description: "Professionally drafted business, employment, and service contracts.",
    details:
      "Our contract drafting ensures legal accuracy, clarity, and enforceability. Ideal for businesses, freelancers, and startups.",
    icon: "📄",
    category: "Corporate",
    price: 150,
    video: "" // optional video URL (YouTube embed link)
  },
  {
    id: 2,
    title: "Legal Consultation",
    description: "Talk to an expert lawyer for 30–60 minutes on any legal matter.",
    details:
      "Discuss disputes, legal strategies, compliance matters, or personal legal concerns with certified professionals.",
    icon: "👨‍⚖️",
    category: "Consultation",
    price: 40,
    video: ""
  },
  {
    id: 3,
    title: "Property Agreement Review",
    description: "Verification of sale deeds, rental agreements & property documents.",
    details:
      "Ensure your property documents are safe, valid, and legally compliant before signing.",
    icon: "🏠",
    category: "Property",
    price: 80,
    video: ""
  },
  {
    id: 4,
    title: "Trademark Registration",
    description: "Register your brand name or logo with government authorities.",
    details: "Full assistance from trademark search to filing and follow-ups.",
    icon: "™️",
    category: "IP",
    price: 200,
    video: ""
  },
  {
    id: 5,
    title: "Legal Notice Drafting",
    description: "Send strong legal notices for disputes, payments & complaints.",
    details: "Get legally enforceable notices drafted by professionals for maximum impact.",
    icon: "✉️",
    category: "Litigation",
    price: 60,
    video: ""
  },
  {
    id: 6,
    title: "Startup Compliance",
    description: "Company registration, GST filing, partnership deeds, and more.",
    details: "Perfect for new businesses needing legal structure & compliance roadmap.",
    icon: "🚀",
    category: "Corporate",
    price: 120,
    video: ""
  },
  {
    id: 7,
    title: "Cyber Crime Assistance",
    description: "Support for fraud, harassment, online threats, and cyber complaints.",
    details: "Certified cyber-law professionals help you report and act against cyber offences.",
    icon: "🔐",
    category: "Cyber",
    price: 90,
    video: ""
  },
  {
    id: 8,
    title: "Family & Divorce Consultation",
    description: "Legal guidance for separation, custody, and family matters.",
    details: "Talk to experienced family-law experts for sensitive situations.",
    icon: "❤️",
    category: "Family",
    price: 70,
    video: ""
  }
];

export default function Listings() {
  const navigate = useNavigate();

  // app state
  const [listings, setListings] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favourites, setFavourites] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set()); // for expandable cards
  const [selectedModal, setSelectedModal] = useState(null); // for Learn More modal
  const [sortBy, setSortBy] = useState("popular"); // placeholder sort

  // load data (replace with fetch when backend ready)
  useEffect(() => {
    // in real app: fetch('/api/listings')...
    setListings(SAMPLE_LISTINGS);
  }, []);

  // categories computed
  const categories = useMemo(() => {
    const cats = new Set(listings.map((l) => l.category));
    return ["All", ...Array.from(cats)];
  }, [listings]);

  // filtered + searched listings
  const visible = useMemo(() => {
    let out = [...listings];
    if (selectedCategory && selectedCategory !== "All") {
      out = out.filter((l) => l.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price-low") out.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") out.sort((a, b) => b.price - a.price);
    // 'popular' keep as is
    return out;
  }, [listings, selectedCategory, query, sortBy]);

  // toggle favourite
  const toggleFav = (id) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // toggle expand
  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // book now -> navigate to service-request and pass state
  // inside Listings() component
  const bookNow = (item) => {
  // Navigate directly to lawyer selection and pass the chosen service in location.state
  navigate("/lawyer-matching", { state: { serviceCategory: item.title, fromListing: true } });
  };


  return (
    <div className="listings-wrapper">
      <div className="listings-header">
        <h2 className="listings-title">Available Legal Services</h2>

        <div className="listings-controls">
          <input
            className="search-input"
            placeholder="Search services, e.g. 'trademark', 'contract'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Sort: Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="category-chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${c === selectedCategory || (c === "All" && !selectedCategory) ? "chip-active" : ""}`}
              onClick={() => setSelectedCategory(c === "All" ? "" : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="listings-grid">
        {visible.map((l) => {
          const isFav = favourites.has(l.id);
          const isExpanded = expanded.has(l.id);
          return (
            <div key={l.id} className={`listing-card ${isExpanded ? "expanded" : ""}`}>
              <div className="listing-top">
                <div className="listing-icon">{l.icon}</div>
                <div className="listing-head">
                  <h3>{l.title}</h3>
                  <p className="listing-desc">{l.description}</p>
                </div>

                <div className="listing-actions">
                  <button
                    className={`fav-btn ${isFav ? "fav-active" : ""}`}
                    title={isFav ? "Remove favourite" : "Add to favourites"}
                    onClick={() => toggleFav(l.id)}
                  >
                    {isFav ? "★" : "☆"}
                  </button>

                  <div className="price-tag">₹{l.price}</div>
                </div>
              </div>

              <div className="listing-buttons">
                <button className="btn-learn" onClick={() => setSelectedModal(l)}>
                  Learn More
                </button>

                <button className="btn-book" onClick={() => bookNow(l)}>
                  Book Now
                </button>

                <button className="btn-expand" onClick={() => toggleExpand(l.id)}>
                  {isExpanded ? "Collapse" : "Details"}
                </button>
              </div>

              {isExpanded && (
                <div className="expanded-content">
                  <p>{l.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Learn More (video/pricing/details) */}
      {selectedModal && (
        <div className="modal-overlay" onClick={() => setSelectedModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">{selectedModal.icon}</div>
              <h2>{selectedModal.title}</h2>
              <div className="modal-price">Starting at ₹{selectedModal.price}</div>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selectedModal.details}</p>

              {/* optional video (if url present) */}
              {selectedModal.video ? (
                <div className="modal-video">
                  <iframe
                    title="service-video"
                    width="100%"
                    height="220"
                    src={selectedModal.video}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </div>

            <div className="modal-actions">
              <button className="btn-learn" onClick={() => setSelectedModal(null)}>
                Close
              </button>
              <button
                className="btn-book"
                onClick={() => {
                  setSelectedModal(null);
                  bookNow(selectedModal);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
