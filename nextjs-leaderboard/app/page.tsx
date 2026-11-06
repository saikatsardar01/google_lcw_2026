
"use client";

import DeadlineBar from "@/components/DeadlineBar";
import { useEffect, useMemo, useState } from "react";

import {
  Users,
  Award,
  Trophy,
  Search,
  RefreshCw,
  Medal,
  CheckCircle2,
  XCircle,
  Sparkles,
  GraduationCap,
} from "lucide-react";

type Color = "green" | "blue" | "yellow" | "red";

interface Participant {
  id: string;
  userName: string;
  accessCodeRedemptionStatus: string;
  skillBadgesCompletedCount: number;
  color: Color;
  rank: number;
}

interface LeaderboardData {
  title: string;
  lastUpdated: string;
  totalParticipants: number;
  participants: Participant[];
}

const COLORS: Record<Color, string> = {
  green: "#34A853",
  blue: "#4285F4",
  yellow: "#FBBC05",
  red: "#EA4335",
};

export default function Home() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  async function loadLeaderboard() {
    try {
      setRefreshing(true);

      const response = await fetch(
        `/leaderboard.json?t=${Date.now()}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Could not load leaderboard.");
      }

      const result: LeaderboardData = await response.json();

      setData(result);
      setError("");
    } catch {
      setError("Unable to load leaderboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLeaderboard();

    const interval = setInterval(loadLeaderboard, 60000);

    return () => clearInterval(interval);
  }, []);

  const participants = data?.participants ?? [];

  // Achievement priority: Green → Blue → Yellow → Red
  const sortedParticipants = useMemo(() => {
    const priority: Record<Color, number> = {
      green: 1,
      blue: 2,
      yellow: 3,
      red: 4,
    };

    return [...participants]
      .sort((a, b) => {
        // First: Sort by achievement colour
        const colorDifference =
          priority[a.color] - priority[b.color];

        if (colorDifference !== 0) {
          return colorDifference;
        }

        // Second: Highest skill badges first
        const badgeDifference =
          b.skillBadgesCompletedCount -
          a.skillBadgesCompletedCount;

        if (badgeDifference !== 0) {
          return badgeDifference;
        }

        // Third: Alphabetical order
        return a.userName.localeCompare(b.userName);
      })
      .map((person, index) => ({
        ...person,
        rank: index + 1,
      }));
  }, [participants]);

  const stats = useMemo(() => ({
    total: participants.length,

    green: participants.filter(p => p.color === "green").length,
    blue: participants.filter(p => p.color === "blue").length,
    yellow: participants.filter(p => p.color === "yellow").length,
    red: participants.filter(p => p.color === "red").length,

    totalBadges: participants.reduce(
      (sum, p) => sum + p.skillBadgesCompletedCount,
      0
    ),
  }), [participants]);

  const filteredParticipants = useMemo(() => {
    return sortedParticipants.filter(person => {
      const matchesSearch = person.userName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || person.color === filter;

      return matchesSearch && matchesFilter;
    });
  }, [sortedParticipants, search, filter]);

  function initials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0])
      .join("")
      .toUpperCase();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader" />
        <p>Loading leaderboard...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="loading-screen">
        <h2>Leaderboard unavailable</h2>
        <p>{error || "No leaderboard data found."}</p>
        <button onClick={loadLeaderboard}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="dashboard">

      {/* HEADER */}

      <header className="header">
        <div className="brand">
          <img
            src="../google-logo.png"
            alt="Google"
            className="google-logo"
          />

          <div>
            <h2>LEARN WITH COMMUNITIES</h2>
            <p>COMMUNITY CHALLENGE 2026</p>
          </div>
        </div>

        <div className="header-right">
          <span className="live-status">
            <span className="live-dot" />
            Live Leaderboard
          </span>

          <button
            className="refresh-button"
            onClick={loadLeaderboard}
            disabled={refreshing}
            aria-label="Refresh leaderboard"
            title="Refresh leaderboard"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "spinning" : ""}
            />
          </button>
        </div>
      </header>

      {/* HERO */}

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            COMMUNITY CHALLENGE 2026
          </span>

          <h1>
            Learn more.
            <br />
            <span>Achieve more.</span>
          </h1>

          <p>
            Celebrate your learning journey, complete
            Google Skills badges, and climb the
            community leaderboard.
          </p>

          <div className="hero-caption">
            <Sparkles size={17} />
            Every badge is a new achievement.
          </div>
        </div>

        <div className="hero-decoration">
          <div className="color-orb orb-blue" />
          <div className="color-orb orb-red" />
          <div className="color-orb orb-yellow" />
          <div className="color-orb orb-green" />

          <div className="hero-center">
            <GraduationCap size={58} />
          </div>
        </div>
      </section>
      {/* DeadlineBar */}
      <DeadlineBar />
      {/* STATISTICS */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue-bg">
              <Users size={21} />
            </div>
            <span className="stat-caption">COMMUNITY</span>
          </div>

          <p>Total Participants</p>
          <h2>{stats.total.toLocaleString("en-IN")}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon green-bg">
              <CheckCircle2 size={21} />
            </div>
            <span className="stat-caption">ACHIEVERS</span>
          </div>

          <p>Green Achievers</p>
          <h2>{stats.green.toLocaleString("en-IN")}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon yellow-bg">
              <Award size={21} />
            </div>
            <span className="stat-caption">PROGRESS</span>
          </div>

          <p>Total Skill Badges</p>
          <h2>{stats.totalBadges.toLocaleString("en-IN")}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon red-bg">
              <XCircle size={21} />
            </div>
            <span className="stat-caption">PENDING</span>
          </div>

          <p>Access Not Redeemed</p>
          <h2>{stats.red.toLocaleString("en-IN")}</h2>
        </div>

      </section>

      {/* COLOR FILTERS */}

      <section className="legend-section">
        <div>
          <h3>Achievement Levels</h3>
          <p>Filter participants by achievement level</p>
        </div>

        <div className="legend-list">

          <button
            className={`legend-item ${filter === "all" ? "selected" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
            <span className="legend-count">{stats.total}</span>
          </button>

          {(["green", "blue", "yellow", "red"] as Color[]).map(color => (
            <button
              key={color}
              aria-label={`Filter ${color} participants`}
              title={`${color} participants`}
              className={`legend-item ${filter === color ? "selected" : ""}`}
              onClick={() =>
                setFilter(filter === color ? "all" : color)
              }
            >
              <span
                className="legend-dot"
                style={{ background: COLORS[color] }}
              />

              <span className="legend-count">
                {stats[color]}
              </span>
            </button>
          ))}

        </div>
      </section>

      {/* TOP THREE */}

      {filter === "all" && search === "" && participants.length > 0 && (
        <section className="top-section">

          <div className="section-heading">
            <div>
              <span className="eyebrow">THE BEST OF THE BEST</span>
              <h2>Top Performers</h2>
            </div>

            <span className="top-label">
              <Trophy size={14} />
              TOP 3
            </span>
          </div>

          <div className="podium">

            {[1, 0, 2].map(index => {
              const person = sortedParticipants[index];

              if (!person) return null;

              const position = index + 1;

              return (
                <div
                  key={person.id}
                  className={`podium-card podium-${position}`}
                >
                  <div className="podium-rank">
                    {position === 1 ? "🥇" :
                      position === 2 ? "🥈" : "🥉"}
                  </div>

                  <div
                    className="avatar"
                    style={{
                      background: COLORS[person.color]
                    }}
                  >
                    {initials(person.userName)}
                  </div>

                  <h3>{person.userName}</h3>

                  <div
                    className="podium-level-dot"
                    style={{
                      background: COLORS[person.color]
                    }}
                    title={`${person.color} level`}
                  />

                  <h2>
                    {person.skillBadgesCompletedCount}
                  </h2>

                  <p>Skill Badges Completed</p>
                </div>
              );
            })}

          </div>
        </section>
      )}

      {/* LEADERBOARD */}

      <section className="leaderboard-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">COMMUNITY RANKINGS</span>
            <h2>Leaderboard</h2>
            <p>
              {filteredParticipants.length} participants displayed
            </p>
          </div>

          <div className="updated">
            <span className="live-dot" />
            Last synced · {formatDate(data.lastUpdated)}
          </div>
        </div>

        {/* SEARCH */}

        <div className="table-controls">

          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search participants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
          </select>

        </div>

        {/* TABLE */}

        <div className="table-wrapper">

          <table>
            <thead>
              <tr>
                <th>RANK</th>
                <th>PARTICIPANT</th>
                <th>ACCESS CODE</th>
                <th>SKILL BADGES</th>
                <th>LEVEL</th>
              </tr>
            </thead>

            <tbody>

              {filteredParticipants.map(person => (

                <tr key={person.id}>

                  <td>
                    <span className="rank-number">
                      #{person.rank}
                    </span>
                  </td>

                  <td>
                    <div className="participant">

                      <div
                        className="small-avatar"
                        style={{
                          background: COLORS[person.color]
                        }}
                      >
                        {initials(person.userName)}
                      </div>

                      <strong>{person.userName}</strong>

                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        person.accessCodeRedemptionStatus.toLowerCase() === "yes"
                          ? "status-yes"
                          : "status-no"
                      }
                    >
                      {person.accessCodeRedemptionStatus.toLowerCase() === "yes"
                        ? <CheckCircle2 size={15} />
                        : <XCircle size={15} />
                      }

                      {person.accessCodeRedemptionStatus}
                    </span>
                  </td>

                  <td>
                    <div className="badge-count">
                      <Award size={17} />
                      <strong>
                        {person.skillBadgesCompletedCount}
                      </strong>
                    </div>
                  </td>

                  <td>
                    <span
                      className="level-indicator"
                      style={{
                        background: COLORS[person.color]
                      }}
                      title={`${person.color} level`}
                      role="img"
                      aria-label={`${person.color} level`}
                    />
                  </td>

                </tr>

              ))}

              {filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <Search size={25} />
                    <p>No participants found.</p>
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="google-colors">
          <span className="g-blue" />
          <span className="g-red" />
          <span className="g-yellow" />
          <span className="g-green" />
        </div>

        <p>Made for Google Learn with Communities</p>

        <p>Keep Learning. Keep Growing.</p>

      </footer>

    </main>
  );
}
