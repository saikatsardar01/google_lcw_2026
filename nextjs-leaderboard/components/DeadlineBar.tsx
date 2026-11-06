
"use client";

import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-11-22T23:59:59+05:30").getTime();
const START_DATE = new Date("2026-11-01T00:00:00+05:30").getTime();

export default function DeadlineBar() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const difference = Math.max(0, DEADLINE - now);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });

      const elapsed = now - START_DATE;
      const duration = DEADLINE - START_DATE;

      setProgress(
        Math.min(100, Math.max(0, (elapsed / duration) * 100))
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const expired = Date.now() >= DEADLINE;

  return (
    <section className="deadline-card">
      <div className="deadline-top">
        <div className="deadline-heading">
          <div className="deadline-icon">⏳</div>
          <div>
            <span className="deadline-eyebrow">COMMUNITY CHALLENGE 2026</span>
            <h3>{expired ? "Challenge deadline reached!" : "The finish line is approaching"}</h3>
            <p>Complete your Google Skills badges before the deadline.</p>
          </div>
        </div>

        <div className="deadline-date">
          <span>FINAL DEADLINE</span>
          <strong>23 NOV 2026</strong>
        </div>
      </div>

      {!expired ? (
        <>
          <div className="countdown-grid">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINUTES", value: timeLeft.minutes },
              { label: "SECONDS", value: timeLeft.seconds },
            ].map((item) => (
              <div className="countdown-unit" key={item.label}>
                <strong>{String(item.value).padStart(2, "0")}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="deadline-progress">
            <div className="progress-label">
              <span>Challenge timeline</span>
              <strong>{progress.toFixed(1)}% elapsed</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <p className="deadline-expired">
          Thank you for being part of Community Challenge 2026!
        </p>
      )}
    </section>
  );
}
