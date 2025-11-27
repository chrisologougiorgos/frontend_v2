// src/pages/ActivityDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activityService } from '../api/activityService';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTime } from '../utils/formatters';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  BarChart,
  User,
  Package,
} from 'lucide-react';

const ActivityDetails = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  useEffect(() => {
    activityService.getActivityDetails(userId, id).then((data) => {
      console.log('Backend Data Received:', data);
      setDetails(data);
    });
  }, [id, userId]);

  if (!details) return <div className="container">Loading...</div>;

  const displayTime = details.time || formatTime(details.date);
  const location = details.location || 'No location specified';
  const difficulty = details.difficultyLevel || details.difficulty || 'N/A';
  const equipment = details.equipment || [];
  const current = details.currentParticipants || 0;
  const max = details.maxParticipants || '?';

  const participants = Array.isArray(details.participants)
    ? details.participants
    : [];

  const MAX_VISIBLE = 2;
  const visibleParticipants = showAllParticipants
    ? participants
    : participants.slice(0, MAX_VISIBLE);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // 🔹 Ονόματα που θα χρησιμοποιηθούν στο Chat από participants
  const chatUser1 = participants[0]?.username || 'Aimilia';
  const chatUser2 = participants[1]?.username || 'Giorgos C.';

  return (
    <div className="container">
      {/* ===== HEADER (green pill) ===== */}
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
        <ArrowLeft
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: 18,
          }}
          onClick={() => navigate(-1)}
        />
        <h2 style={{ margin: 0, fontSize: '18px' }}>
          {details.activityType || 'Activity'}
        </h2>
      </div>

      {/* ===== DETAILS CARD ===== */}
      <div className="card">
        <h3
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '8px',
            margin: '0 0 10px 0',
            fontSize: '16px',
          }}
        >
          Details
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            fontSize: '13px',
          }}
        >
          {/* date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '12px',
              background: '#f7f7f7',
            }}
          >
            <Calendar size={16} /> {formatDate(details.date)}
          </div>

          {/* difficulty */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '12px',
              background: '#f7f7f7',
            }}
          >
            <BarChart size={16} /> {difficulty}
          </div>

          {/* time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '12px',
              background: '#f7f7f7',
            }}
          >
            <Clock size={16} /> {displayTime}
          </div>

          {/* participants */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '12px',
              background: '#f7f7f7',
            }}
          >
            <User size={16} /> {current}/{max}
          </div>

          {/* location */}
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '12px',
              background: '#f7f7f7',
            }}
          >
            <MapPin size={16} /> {location}
          </div>

          {/* equipment */}
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '12px',
              background: '#f7f7f7',
            }}
          >
            <Package size={16} />{' '}
            {Array.isArray(equipment) ? equipment.join(', ') : equipment}
          </div>
        </div>
      </div>

      {/* ===== USERS CARD (με dropdown) ===== */}
      <div className="card">
        <h3
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '8px',
            margin: '0 0 10px 0',
            fontSize: '16px',
          }}
        >
          Users
        </h3>

        {participants.length > 0 ? (
          <>
            {visibleParticipants.map((u, index) => (
              <div
                key={u.userId || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Avatar circle */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--primary-green)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {getInitials(u.username)}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      {u.username || 'User'}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                      }}
                    >
                      Participant
                    </div>
                  </div>
                </div>

                <button
                  className="btn-secondary"
                  style={{
                    borderRadius: '20px',
                    padding: '4px 14px',
                    fontSize: '12px',
                    color: 'var(--primary-green)',
                    border: '2px solid var(--primary-green)',
                    background: 'white',
                  }}
                >
                  View
                </button>
              </div>
            ))}

            {/* Dropdown arrow button */}
            {participants.length > MAX_VISIBLE && (
              <button
                className="pinned-toggle-btn"
                onClick={() =>
                  setShowAllParticipants((prev) => !prev)
                }
                style={{
                  marginTop: '4px',
                  fontSize: '22px',
                }}
              >
                {showAllParticipants ? '▲' : '▼'}
              </button>
            )}
          </>
        ) : (
          <p style={{ color: '#999', fontSize: '14px' }}>
            No participant info available.
          </p>
        )}
      </div>

      {/* ===== CHAT CARD (ονόματα από participants) ===== */}
      <div className="card" style={{ marginTop: '12px' }}>
        <h3
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '8px',
            margin: '0 0 10px 0',
            fontSize: '16px',
          }}
        >
          Chat
        </h3>

        <div
          style={{
            background: '#e5f8d9',
            borderRadius: '12px',
            padding: '10px',
          }}
        >
          {/* Μήνυμα 1 – από τον πρώτο participant */}
          <div style={{ marginBottom: '10px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              {chatUser1}
            </div>
            <div
              style={{
                background: '#5cb85c',
                color: 'white',
                padding: '8px 10px',
                borderRadius: '12px',
                display: 'inline-block',
                fontSize: '13px',
              }}
            >
              Hey everyone! Are we doing a warm-up together?
            </div>
          </div>

          {/* Μήνυμα 2 – από τον δεύτερο participant */}
          <div style={{ marginBottom: '10px' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              {chatUser2}
            </div>
            <div
              style={{
                background: '#5cb85c',
                color: 'white',
                padding: '8px 10px',
                borderRadius: '12px',
                display: 'inline-block',
                fontSize: '13px',
              }}
            >
              Yes, let's meet 15 min earlier for stretching.
            </div>
          </div>

          {/* Μήνυμα 3 (κεντρικό, χωρίς όνομα στο mockup) */}
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <div
              style={{
                background: '#f5f5f5',
                padding: '8px 10px',
                borderRadius: '12px',
                display: 'inline-block',
                fontSize: '13px',
              }}
            >
              Does anyone know if there are water fountains along the
              route?
            </div>
          </div>

          {/* System message */}
          <div
            style={{
              marginTop: '12px',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '8px 10px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#777',
            }}
          >
            The activity has been completed!
          </div>
        </div>
      </div>

      {/* ===== REVIEW BUTTON ===== */}
      <button
        className="btn"
        style={{
          width: '100%',
          marginTop: '20px',
          background: 'var(--warning-yellow)',
          color: '#000',
          borderRadius: '999px',
          fontWeight: 600,
          boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
        }}
        onClick={() =>
          navigate(`/review/${id}`, {
            state: { participants: details.participants || [] },
          })
        }
      >
        Review Activity
      </button>
    </div>
  );
};

export default ActivityDetails;
