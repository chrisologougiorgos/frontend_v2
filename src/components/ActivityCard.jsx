// src/components/ActivityCard.jsx
import React from 'react';
import { Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatters';

const ActivityCard = ({
  activity,
  type = 'feed',
  onAction,
  onTogglePin,
}) => {
  const navigate = useNavigate();
  const { activityId, details } = activity;

  // Fallback για pinned flag
  const isPinned = activity.isPinned ?? activity.pinned ?? false;

  // ----- BUTTON LOGIC -----
  const renderActionButton = () => {
    if (!onAction) return null;

    // UPCOMING FEED → JOIN
    if (type === 'feed' || type === 'pinned') {
      return (
        <button
          className="btn-primary action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAction(activityId);
          }}
        >
          Join
        </button>
      );
    }

    // MY UPCOMING → LEAVE
    if (type === 'my_upcoming') {
      return (
        <button
          className="btn-leave action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAction(activityId);
          }}
        >
          Leave
        </button>
      );
    }

    // MY COMPLETED → SAVE
    if (type === 'my_completed') {
      return (
        <button
          className="btn-save action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAction(activityId);
          }}
        >
          Save
        </button>
      );
    }

    return null;
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      {/* ---------- PIN BUTTON ---------- */}
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(activityId, isPinned);
          }}
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <Pin
            size={20}
            strokeWidth={2.2}
            style={{
              transform: 'rotate(45deg)',
              color: isPinned ? 'black' : 'gray',
              fill: isPinned ? 'black' : 'transparent',
              transition: '0.2s ease',
            }}
          />
        </button>
      )}

      {/* ---------- CONTENT ---------- */}
      <div style={{ paddingLeft: onTogglePin ? '35px' : '0px' }}>
        <h3 style={{ marginBottom: '5px' }}>{details.activityType}</h3>

        <div className="text-muted" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
          <div>Date: {formatDate(details.date)}</div>
          <div>Time: {details.time}</div>
          <div>Location: {details.location}</div>
        </div>

        <div
          style={{
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              textDecoration: 'underline',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/activity/${activityId}`)}
          >
            View details
          </span>

          {renderActionButton()}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
