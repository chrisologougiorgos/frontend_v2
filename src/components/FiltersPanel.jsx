// src/components/FiltersPanel.jsx
import React, { useState } from "react";
import "./FiltersPanel.css";

const FiltersPanel = ({ initialFilters, onApply, onClose }) => {
  const [filters, setFilters] = useState(initialFilters || {});

  const [open, setOpen] = useState({
    type: true,
    date: true,
    location: true,
    participants: true,
    difficulty: true,
  });

  const toggleSection = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleRadio = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    onApply({});
    onClose();
  };

  const apply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="filters-panel-inline">
      <div className="panel-header">
        <h3>Filters</h3>
        <button className="apply-btn-top" onClick={apply}>
          Apply
        </button>
      </div>

      {/* TYPE */}
      <div className="accordion-section">
        <div
          className="accordion-header"
          onClick={() => toggleSection("type")}
        >
          <span>Type</span>
          <span>{open.type ? "▲" : "▼"}</span>
        </div>

        {open.type && (
          <div className="accordion-body">
            {[
              "Running",
              "Hiking",
              "Walking",
              "Rock climbing",
              "Mountain biking",
              "Beach Volley",
            ].map((t) => (
              <label key={t} className="radio-item">
                <input
                  type="radio"
                  name="type"
                  checked={filters.type === t}
                  onChange={() => handleRadio("type", t)}
                />
                {t}
              </label>
            ))}
            <label className="radio-item">
              <input
                type="radio"
                name="type"
                checked={!filters.type}
                onChange={() => handleRadio("type", "")}
              />
              All
            </label>
          </div>
        )}
      </div>

      {/* DATE */}
      <div className="accordion-section">
        <div
          className="accordion-header"
          onClick={() => toggleSection("date")}
        >
          <span>Date</span>
          <span>{open.date ? "▲" : "▼"}</span>
        </div>

        {open.date && (
          <div className="accordion-body">
            <label>From:</label>
            <input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) =>
                setFilters((p) => ({ ...p, dateFrom: e.target.value }))
              }
            />
            <label>To:</label>
            <input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) =>
                setFilters((p) => ({ ...p, dateTo: e.target.value }))
              }
            />
          </div>
        )}
      </div>

      {/* LOCATION */}
      <div className="accordion-section">
        <div
          className="accordion-header"
          onClick={() => toggleSection("location")}
        >
          <span>Location</span>
          <span>{open.location ? "▲" : "▼"}</span>
        </div>

        {open.location && (
          <div className="accordion-body">
            {["Athens", "Patras", "Thessaloniki", "Ioannina"].map((l) => (
              <label key={l} className="radio-item">
                <input
                  type="radio"
                  name="location"
                  checked={filters.location === l}
                  onChange={() => handleRadio("location", l)}
                />
                {l}
              </label>
            ))}
            <label className="radio-item">
              <input
                type="radio"
                name="location"
                checked={!filters.location}
                onChange={() => handleRadio("location", "")}
              />
              All
            </label>
          </div>
        )}
      </div>

      {/* PARTICIPANTS */}
      <div className="accordion-section">
        <div
          className="accordion-header"
          onClick={() => toggleSection("participants")}
        >
          <span>Participants</span>
          <span>{open.participants ? "▲" : "▼"}</span>
        </div>

        {open.participants && (
          <div className="accordion-body">
            <input
              type="range"
              min="1"
              max="20"
              value={filters.participants || 10}
              onChange={(e) =>
                setFilters((p) => ({ ...p, participants: e.target.value }))
              }
            />
            <div>Selected: {filters.participants || 10}</div>
          </div>
        )}
      </div>

      {/* DIFFICULTY */}
      <div className="accordion-section">
        <div
          className="accordion-header"
          onClick={() => toggleSection("difficulty")}
        >
          <span>Level of difficulty</span>
          <span>{open.difficulty ? "▲" : "▼"}</span>
        </div>

        {open.difficulty && (
          <div className="accordion-body">
            {["Beginner", "Intermediate", "Advanced"].map((d) => (
              <label key={d} className="radio-item">
                <input
                  type="radio"
                  name="difficulty"
                  checked={filters.difficulty === d}
                  onChange={() => handleRadio("difficulty", d)}
                />
                {d}
              </label>
            ))}
            <label className="radio-item">
              <input
                type="radio"
                name="difficulty"
                checked={!filters.difficulty}
                onChange={() => handleRadio("difficulty", "")}
              />
              All
            </label>
          </div>
        )}
      </div>

      <button className="clear-btn" onClick={clearFilters}>
        Clear filters
      </button>
    </div>
  );
};

export default FiltersPanel;
