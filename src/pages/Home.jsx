// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ActivityCard from "../components/ActivityCard";
import StatusModal from "../components/StatusModal";
import { activityService } from "../api/activityService";
import { useAuth } from "../context/AuthContext";
import useActivities from "../hooks/useActivities";
import { Filter } from "lucide-react";
import FiltersPanel from "../components/FiltersPanel";

const Home = () => {
  const { userId } = useAuth();

  // 🔹 1. Upcoming activities (ΦΙΛΤΡΑΡΙΣΜΕΝΑ)
  const {
    activities: upcomingActivities,
    loading,
    error,
    currentFilters,
    handleApplyFilters,
  } = useActivities();

  // 🔹 2. Pinned activities (ΞΕΧΩΡΙΣΤΗ ΛΙΣΤΑ, ΧΩΡΙΣ ΦΙΛΤΡΑ)
  const [pinnedActivities, setPinnedActivities] = useState([]);
  const [loadingPinned, setLoadingPinned] = useState(true);
  const [errorPinned, setErrorPinned] = useState(null);
  const [showPinned, setShowPinned] = useState(true);

  // 🔹 3. Λοιπά state
  const [showFilters, setShowFilters] = useState(false);
  const [modalMsg, setModalMsg] = useState(null);

  // === helper για fetch pinned από backend ===
  const fetchPinned = async () => {
    if (!userId) return;
    try {
      setLoadingPinned(true);
      const data = await activityService.getPinnedActivities(userId);
      setPinnedActivities(Array.isArray(data) ? data : []);
      setErrorPinned(null);
    } catch (err) {
      console.error("Error fetching pinned activities:", err);
      setErrorPinned(err);
      setPinnedActivities([]);
    } finally {
      setLoadingPinned(false);
    }
  };

  // === Φέρνουμε pinned activities στην αρχή ===
  useEffect(() => {
    fetchPinned();
  }, [userId]);

  // Modal όταν δεν βρίσκει upcoming
  useEffect(() => {
    if (
      !loading &&
      !error &&
      Array.isArray(upcomingActivities) &&
      upcomingActivities.length === 0
    ) {
      setModalMsg({
        type: "error",
        text: "No activities found!",
        filterAgain: true,
      });
    }
  }, [loading, error, upcomingActivities]);

  // JOIN (χρησιμοποιείται και από pinned και από upcoming)
  const handleJoin = async (id) => {
    try {
      await activityService.joinActivity(userId, id);
      setModalMsg({ type: "success", text: "Request sent!" });
    } catch (e) {
      console.error("Join error:", e);
      const serverMsg = e?.response?.data?.message || e.message;
      setModalMsg({
        type: "error",
        text: serverMsg || "Failed to join activity.",
      });
    }
  };

  const handleFiltersApply = (newFilters) => {
    // Τα filters επηρεάζουν ΜΟΝΟ τα upcoming activities
    handleApplyFilters(newFilters);
  };

  // 🔹 PIN button handler – κάνει ΚΑΙ pin ΚΑΙ unpin
  const handleTogglePin = async (activityId, isPinned) => {
    try {
      if (isPinned) {
        // Ήταν pinned → UNPIN
        await activityService.unpinActivity(userId, activityId);
      } else {
        // Δεν ήταν pinned → PIN
        await activityService.pinActivity(userId, activityId);
      }

      // Ξαναφέρε τη λίστα των pinned από το backend
      await fetchPinned();
    } catch (err) {
      console.error("Error toggling pin:", err);
    }
  };

  // 🔹 ΜΗΝ δείχνεις pinned ξανά στα upcoming
  const pinnedIds = new Set(
    (pinnedActivities || []).map((a) => a.activityId)
  );

  const upcomingWithoutPinned = Array.isArray(upcomingActivities)
    ? upcomingActivities.filter((a) => !pinnedIds.has(a.activityId))
    : [];

  return (
    <div className="container">
      <Navbar />

      {/* ----------- PINNED ACTIVITIES (ξεχωριστή λίστα) ----------- */}
      <section className="card">
        <div className="pinned-header">
          <h3>Pinned Activities</h3>
        </div>

        {loadingPinned && <p>Loading pinned activities...</p>}
        {errorPinned && !loadingPinned && (
          <p style={{ color: "red" }}>Failed to load pinned activities.</p>
        )}

        {showPinned && !loadingPinned && !errorPinned && (
          <>
            {pinnedActivities.length > 0 ? (
              pinnedActivities.map((act) => (
                <ActivityCard
                  key={act.activityId}
                  // ΕΞΑΝΑΓΚΑΖΟΥΜΕ isPinned = true εδώ
                  activity={{ ...act, isPinned: true }}
                  type="pinned"
                  onAction={handleJoin}
                  onTogglePin={handleTogglePin}
                />
              ))
            ) : (
              <p style={{ marginTop: "8px" }}>No pinned activities.</p>
            )}
          </>
        )}

        <button
          className="pinned-toggle-btn"
          onClick={() => setShowPinned((prev) => !prev)}
        >
          {showPinned ? "▼" : "▲"}
        </button>
      </section>

      {/* ----------- UPCOMING ACTIVITIES (επηρεάζονται από filters) ----------- */}
      <section className="card">
        <div className="upcoming-header">
          <h3>Upcoming Activities</h3>
          <div
            className="filters-button"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter size={18} />
            <span>Filters</span>
          </div>
        </div>

        {/* Filters panel μέσα στην κάρτα – ΑΦΟΡΑ ΜΟΝΟ UPCOMING */}
        {showFilters && (
          <FiltersPanel
            initialFilters={currentFilters}
            onApply={handleFiltersApply}
            onClose={() => setShowFilters(false)}
          />
        )}

        {loading && <p>Loading activities...</p>}
        {error && !loading && (
          <p style={{ color: "red" }}>Failed to load activities.</p>
        )}

        <div className="upcoming-list">
          {upcomingWithoutPinned.map((act) => (
            <ActivityCard
              key={act.activityId}
              // ΕΞΑΝΑΓΚΑΖΟΥΜΕ isPinned = false εδώ
              activity={{ ...act, isPinned: false }}
              type="feed"
              onAction={handleJoin}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      </section>

      {/* Status modal */}
      {modalMsg && (
        <StatusModal
          type={modalMsg.type}
          message={modalMsg.text}
          onClose={() => setModalMsg(null)}
          actionLabel={modalMsg.filterAgain ? "Filter" : null}
          onAction={
            modalMsg.filterAgain
              ? () => {
                  setModalMsg(null);
                  setShowFilters(true);
                }
              : null
          }
        />
      )}
    </div>
  );
};

export default Home;
