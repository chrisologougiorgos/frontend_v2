// src/pages/ReviewActivity.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { activityService } from '../api/activityService';
import { useAuth } from '../context/AuthContext';
import { validateReview } from '../utils/validators';
import StarRating from '../components/StarRating';
import { X } from 'lucide-react';

const ReviewActivity = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 👉 Participants που περάσαμε από ActivityDetails
  const participants = location.state?.participants || [];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const validation = validateReview(rating, comment);

    if (!validation.isValid) {
      setError(validation.errors.rating || validation.errors.comment);
      return;
    }

    try {
      await activityService.submitReview(userId, id, { rating, comment });
      alert('Thank you for your feedback!');
      navigate('/my-activities');
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError("The activity hasn't been completed yet!");
        return;
      }
      alert('Thank you for your feedback! (Demo Submission)');
      navigate('/my-activities');
    }
  };

  const wordCount =
    comment.trim() === '' ? 0 : comment.trim().split(/\s+/).length;

  const renderStars = (count) =>
    '★★★★★'
      .split('')
      .map((star, idx) => (
        <span
          key={idx}
          style={{
            color: idx < count ? '#ff9800' : '#ddd',
            fontSize: '13px',
          }}
        >
          ★
        </span>
      ));

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // 🔹 Αν έχουμε participants, φτιάχνουμε reviews από αυτούς
  let reviews = [];
  if (participants.length > 0) {
    reviews = participants.slice(0, 3).map((p, idx) => ({
      id: idx + 1,
      initials: getInitials(p.username),
      name: p.username || 'User',
      date: '18/03/2025',
      text:
        idx === 0
          ? 'Amazing run! Great route and awesome group.'
          : idx === 1
          ? 'Nice experience, the pacing was a bit fast for me.'
          : 'Well organized and fun!',
      stars: 5 - (idx % 2), // 5,4,5,…
    }));
  } else {
    // fallback σε παλιά mock αν ΔΕΝ έχουμε participants
    reviews = [
      {
        id: 1,
        initials: 'GC',
        name: 'Giorgos C.',
        date: '18/03/2025',
        text: 'Amazing run! Great route and awesome group.',
        stars: 5,
      },
      {
        id: 2,
        initials: 'AG',
        name: 'Aimilia G.',
        date: '18/03/2025',
        text: 'Nice experience, but the pacing was a bit fast for me.',
        stars: 4,
      },
    ];
  }

  return (
    <div className="container">
      {/* HEADER pill */}
      <div
        style={{
          margin: '0 0 20px 0',
          marginTop: '4px',
          background: 'var(--primary-green)',
          color: 'white',
          borderRadius: '999px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          Review Activity
        </h2>

        {/* X button δεξιά */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            right: 12,
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Κάρτα: Rating + Feedback */}
      <div
        className="card"
        style={{
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        {error && (
          <div
            style={{
              color: 'var(--error-red)',
              background: '#FFEBEE',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        {/* Πάνω κομμάτι: stars */}
        <div
          style={{
            background: '#f9f9f9',
            borderRadius: '14px',
            padding: '10px 12px 12px 12px',
            marginBottom: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              fontWeight: '600',
              fontSize: '13px',
              marginBottom: '6px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '6px',
            }}
          >
            How do you rate this activity?
          </div>
          <StarRating rating={rating} onRate={setRating} />
        </div>

        {/* Κάτω κομμάτι: textarea */}
        <div
          style={{
            background: '#f9f9f9',
            borderRadius: '14px',
            padding: '10px 12px 12px 12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              fontWeight: '600',
              fontSize: '13px',
              marginBottom: '6px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '6px',
            }}
          >
            Write your feedback
          </div>

          <textarea
            style={{
              width: '100%',
              minHeight: '130px',
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '13px',
              boxSizing: 'border-box',
              background: '#f0f6ed',
            }}
            placeholder="What did and didn't you like?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div
            style={{
              textAlign: 'right',
              fontSize: '12px',
              color: '#777',
              marginTop: '4px',
            }}
          >
            {wordCount}/100
          </div>
        </div>
      </div>

      {/* Submit button (μικρό, δεξιά) */}
      <div style={{ textAlign: 'right', marginBottom: '18px' }}>
        <button
          className="btn"
          style={{
            background: '#444',
            color: 'white',
            padding: '8px 18px',
            borderRadius: '18px',
            fontSize: '13px',
            fontWeight: 600,
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* Reviews list – ονόματα από participants όταν υπάρχουν */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <h3
          style={{
            margin: '0 0 10px 0',
            fontSize: '15px',
          }}
        >
          Reviews ({reviews.length})
        </h3>

        {reviews.map((rev) => (
          <div
            key={rev.id}
            style={{
              background: '#fafafa',
              borderRadius: '14px',
              padding: '10px 12px',
              marginBottom: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--primary-green)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {rev.initials}
                </div>
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 600 }}>{rev.name}</div>
                  <div style={{ color: '#777', fontSize: '11px' }}>
                    {rev.date}
                  </div>
                </div>
              </div>

              <div>{renderStars(rev.stars)}</div>
            </div>

            <div
              style={{
                fontSize: '13px',
                color: '#333',
              }}
            >
              “{rev.text}”
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewActivity;
