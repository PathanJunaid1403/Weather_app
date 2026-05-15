import { useState, useEffect, useRef, useCallback } from "react";
import { fetchCitySuggestions } from "../api/weather";
import "../styles/SearchBar.css";

const HISTORY_KEY = "nimbus_search_history";
const MAX_HISTORY = 6;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery]           = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory]       = useState(loadHistory);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex]  = useState(-1);
  const [fetching, setFetching]     = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef  = useRef(null);

  // ── Build unified flat list for keyboard nav ──────────────────
  // Structure: { type: "history"|"suggestion", label, subLabel, cityName, key }
  const filteredHistory = query.trim().length === 0
    ? history
    : history.filter((h) =>
        h.cityName.toLowerCase().startsWith(query.trim().toLowerCase())
      );

  const dropdownItems = [
    ...filteredHistory.map((h) => ({ type: "history", ...h })),
    ...suggestions.map((c) => ({
      type: "suggestion",
      key: `${c.name}-${c.lat}-${c.lon}`,
      label: c.name,
      subLabel: [c.state, c.country].filter(Boolean).join(", "),
      cityName: c.name,
    })),
  ];

  const shouldShow = showDropdown && (dropdownItems.length > 0 || fetching);

  // ── Debounced fetch ───────────────────────────────────────────
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      // still show if we have history matches
      setShowDropdown(true);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setFetching(true);
      const results = await fetchCitySuggestions(query);
      setSuggestions(results);
      setActiveIndex(-1);
      setFetching(false);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // ── Outside click ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Add to history ────────────────────────────────────────────
  const addToHistory = useCallback((cityName, subLabel = "") => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (h) => h.cityName.toLowerCase() !== cityName.toLowerCase()
      );
      const entry = {
        key: `hist-${cityName}`,
        label: cityName,
        subLabel,
        cityName,
        timestamp: Date.now(),
      };
      const next = [entry, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const removeFromHistory = (e, cityName) => {
    e.stopPropagation();
    setHistory((prev) => {
      const next = prev.filter((h) => h.cityName !== cityName);
      saveHistory(next);
      return next;
    });
  };

  const clearHistory = (e) => {
    e.stopPropagation();
    setHistory([]);
    saveHistory([]);
  };

  // ── Select item ───────────────────────────────────────────────
  const handleSelectItem = (item) => {
    setQuery(item.subLabel ? `${item.label}, ${item.subLabel}` : item.label);
    setShowDropdown(false);
    setSuggestions([]);
    addToHistory(item.cityName, item.subLabel);
    onSearch(item.cityName);
  };

  // ── Form submit ───────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowDropdown(false);
    if (activeIndex >= 0 && dropdownItems[activeIndex]) {
      handleSelectItem(dropdownItems[activeIndex]);
    } else {
      addToHistory(trimmed);
      onSearch(trimmed);
    }
  };

  // ── Keyboard nav ──────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!shouldShow) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, dropdownItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const hasHistory   = filteredHistory.length > 0;
  const hasSuggests  = suggestions.length > 0;

  return (
    <div className="search-container" ref={wrapperRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className={`search-wrapper ${shouldShow ? "dropdown-open" : ""}`}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search city — e.g. Tokyo, Paris, Mumbai..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          {fetching && <span className="suggest-spinner" />}
          {query && (
            <button
              type="button"
              className="clear-btn"
              onMouseDown={(e) => { e.preventDefault(); setQuery(""); setSuggestions([]); }}
              tabIndex={-1}
            >✕</button>
          )}
          <button
            type="submit"
            className="search-btn"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? <span className="btn-spinner" /> : <span>Search</span>}
          </button>
        </div>
      </form>

      {shouldShow && (
        <div className="dropdown-panel">

          {/* ── Recent searches ── */}
          {hasHistory && (
            <div className="dropdown-section">
              <div className="section-header">
                <span className="section-title">🕐 Recent Searches</span>
                <button className="clear-all-btn" onMouseDown={clearHistory}>
                  Clear all
                </button>
              </div>
              <ul className="dropdown-list">
                {filteredHistory.map((item, i) => {
                  const globalIdx = i;
                  return (
                    <li
                      key={item.key}
                      className={`dropdown-item history-item ${globalIdx === activeIndex ? "active" : ""}`}
                      onMouseDown={() => handleSelectItem(item)}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                    >
                      <span className="item-icon">🕐</span>
                      <div className="item-text">
                        <span className="item-label">{item.label}</span>
                        {item.subLabel && (
                          <span className="item-sub">{item.subLabel}</span>
                        )}
                      </div>
                      <button
                        className="remove-btn"
                        onMouseDown={(e) => removeFromHistory(e, item.cityName)}
                        title="Remove"
                      >✕</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ── Divider ── */}
          {hasHistory && (hasSuggests || fetching) && (
            <div className="dropdown-divider" />
          )}

          {/* ── City suggestions ── */}
          {(hasSuggests || fetching) && (
            <div className="dropdown-section">
              <div className="section-header">
                <span className="section-title">📍 Suggestions</span>
                {fetching && <span className="fetching-label">Searching…</span>}
              </div>
              {fetching && !hasSuggests ? (
                <div className="dropdown-loading">
                  <span className="suggest-spinner large" />
                </div>
              ) : (
                <ul className="dropdown-list">
                  {suggestions.map((city, i) => {
                    const globalIdx = filteredHistory.length + i;
                    return (
                      <li
                        key={`${city.name}-${city.lat}-${city.lon}`}
                        className={`dropdown-item ${globalIdx === activeIndex ? "active" : ""}`}
                        onMouseDown={() =>
                          handleSelectItem({
                            type: "suggestion",
                            key: `${city.name}-${city.lat}`,
                            label: city.name,
                            subLabel: [city.state, city.country].filter(Boolean).join(", "),
                            cityName: city.name,
                          })
                        }
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                      >
                        <span className="item-icon">📍</span>
                        <div className="item-text">
                          <span className="item-label">{city.name}</span>
                          <span className="item-sub">
                            {[city.state, city.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* ── Empty state ── */}
          {!hasHistory && !hasSuggests && !fetching && query.trim().length >= 2 && (
            <div className="dropdown-empty">
              <span>😶‍🌫️</span>
              <p>No cities found for "<strong>{query}</strong>"</p>
            </div>
          )}

          {/* ── Empty with no query and no history ── */}
          {!hasHistory && !hasSuggests && !fetching && query.trim().length < 2 && (
            <div className="dropdown-empty">
              <span>🌍</span>
              <p>Start typing to search cities</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;