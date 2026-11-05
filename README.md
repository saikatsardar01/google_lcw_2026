
# Google Learn with Communities

## Community Challenge 2026 🏆

A responsive community leaderboard designed to celebrate learning achievements, track Google Skills badge progress and recognise top-performing participants.

**Learn more. Achieve more. Celebrate your learning journey.**

---

## 📁 Project Structure

```text
google-leaderboard/
│
├── app/
│   ├── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── favicon.ico
│
├── public/
│   ├── data/
│   │   └── leaderboard.json
│   └── google-logo.png
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Achievement Colour System

Participants are assigned one of four Google-inspired colours based on their access code redemption status and completed skill badges.

| Level | Colour | Hex Code | Criteria |
|:---|:---:|:---|:---|
| Green | 🟢 | `#34A853` | Access Code: Yes, Badges: 10 |
| Blue | 🔵 | `#4285F4` | Access Code: Yes, Badges: 5–9 |
| Yellow | 🟡 | `#FBBC05` | Access Code: Yes, Badges: 0–4 |
| Red | 🔴 | `#EA4335` | Access Code: No |

The achievement level is represented by a simple coloured dot in the leaderboard.

---

## 📊 Leaderboard Structure

The main dashboard consists of the following sections:

### 1. Header
- Google logo.
- Learn with Communities branding.
- Community Challenge 2026 identity.
- Live status indicator.
- Refresh button.

### 2. Hero Section
- Community Challenge 2026 heading.
- "Learn more. Achieve more." tagline.
- Short introduction to the challenge.
- Achievement-focused visual design.

### 3. Statistics Dashboard
- Total participants.
- Access codes redeemed.
- Total skill badges completed.
- Participants with all 10 badges.

### 4. Achievement Levels
- Four achievement colours.
- Participant count for each level.
- Interactive filters to filter participants.

### 5. Top Performers
- Top three participants.
- Ranking positions.
- Participant names.
- Completed skill badge counts.
- Achievement colour indicators.

### 6. Community Rankings
- Complete participant leaderboard.
- Search participants by name.
- Filter by achievement level.
- Participant ranking.
- Access code redemption status.
- Skill badges completed.
- Minimal coloured level indicator.

### 7. Last Updated
Displays the latest data synchronisation date and time.

### 8. Footer
- Community Challenge 2026 branding.
- Google-inspired colour accents.
- Copyright information.

---

## 🗂️ Participant Data

The frontend reads participant information from:

`public/data/leaderboard.json`

Each participant contains:

| Field | Description |
|:---|:---|
| `userName` | Participant's name |
| `accessCodeRedemptionStatus` | Yes / No |
| `skillBadgesCompletedCount` | Number of completed badges |

The frontend calculates the participant's achievement level and ranking using this information.

---

## 🖥️ Technology Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** CSS
- **Data Source:** JSON
- **Fonts:** Plus Jakarta Sans and DM Sans

---

## ✨ Design Principles

- Clean, modern and professional interface.
- Rounded corners and soft shadows.
- Google-inspired colour palette.
- Bold typography and clear visual hierarchy.
- Responsive desktop, tablet and mobile layouts.
- Smooth hover interactions.
- Easy-to-read participant rankings.
- Minimal and distraction-free achievement indicators.

---

## 🚀 Project Vision

**Google Learn with Communities - Community Challenge 2026**

*Learn more. Achieve more. Celebrate your learning journey.*

---

<p align="center">
  Made with ❤️ for the learning community.
</p>
