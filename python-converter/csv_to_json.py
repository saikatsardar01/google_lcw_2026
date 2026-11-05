
import csv
import json
import argparse
import uuid

from pathlib import Path
from datetime import datetime, timezone


# ==========================================
# CONFIGURATION
# ==========================================

REQUIRED_COLUMNS = [
    "User Name",
    "Access Code Redemption Status",
    "Skill Badges Completed Count"
]


# ==========================================
# GOOGLE COLOR CLASSIFICATION
# ==========================================

def calculate_color(access_status, badge_count):

    status = str(access_status).strip().lower()

    if status not in ("yes", "no"):
        raise ValueError(
            f"Invalid redemption status: {access_status}"
        )

    if badge_count < 0:
        raise ValueError("Badge count cannot be negative")

    if status == "no":
        return "red"

    if badge_count == 10:
        return "green"

    if badge_count >= 5:
        return "blue"

    return "yellow"


# ==========================================
# READ CSV
# ==========================================

def read_csv_file(file_path):

    with open(
        file_path,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        sample = file.read(8192)
        file.seek(0)

        try:
            dialect = csv.Sniffer().sniff(
                sample,
                delimiters=",\t;"
            )
        except csv.Error:
            dialect = csv.excel

        reader = csv.DictReader(file, dialect=dialect)

        if not reader.fieldnames:
            raise ValueError("CSV file has no headers")

        reader.fieldnames = [
            (name or "").strip()
            for name in reader.fieldnames
        ]

        missing = [
            column
            for column in REQUIRED_COLUMNS
            if column not in reader.fieldnames
        ]

        if missing:
            raise ValueError(
                f"Missing required columns: {missing}"
            )

        return list(reader)


# ==========================================
# CONVERT CSV TO JSON
# ==========================================

def convert_csv_to_json(input_file, output_file):

    rows = read_csv_file(input_file)

    participants = []

    for row_number, row in enumerate(rows, start=2):

        name = (
            row.get("User Name") or ""
        ).strip()

        status = (
            row.get("Access Code Redemption Status") or ""
        ).strip()

        badge_value = (
            row.get("Skill Badges Completed Count") or ""
        ).strip()

        if not name:
            print(f"Skipping row {row_number}: Missing name")
            continue

        try:
            badge_count = int(badge_value)
        except (ValueError, TypeError):
            print(
                f"Skipping row {row_number}: "
                "Invalid badge count"
            )
            continue

        try:
            color = calculate_color(
                status,
                badge_count
            )
        except ValueError as error:
            print(f"Skipping row {row_number}: {error}")
            continue

        participants.append({
            "id": str(uuid.uuid4()),
            "userName": name,
            "accessCodeRedemptionStatus": status.title(),
            "skillBadgesCompletedCount": badge_count,
            "color": color
        })

    # Sort by badge count, then alphabetically
    participants.sort(
        key=lambda person: (
            -person["skillBadgesCompletedCount"],
            person["userName"].casefold()
        )
    )

    # Assign ranks
    for index, participant in enumerate(
        participants,
        start=1
    ):
        participant["rank"] = index

    output_data = {
        "title": "Google Learn with Communities Leaderboard",
        "lastUpdated": datetime.now(
            timezone.utc
        ).isoformat(),
        "totalParticipants": len(participants),
        "participants": participants
    }

    output_path = Path(output_file)

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        output_path,
        "w",
        encoding="utf-8"
    ) as json_file:

        json.dump(
            output_data,
            json_file,
            indent=4,
            ensure_ascii=False
        )

    print("\n================================")
    print("LEADERBOARD UPDATED SUCCESSFULLY")
    print("================================")
    print(f"Total participants: {len(participants)}")
    print(f"Output file: {output_path.resolve()}")
    print("================================\n")


# ==========================================
# COMMAND LINE
# ==========================================

if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Google Leaderboard CSV to JSON"
    )

    parser.add_argument(
        "--input",
        required=True,
        help="Path to Google CSV file"
    )

    parser.add_argument(
        "--output",
        default="../nextjs-leaderboard/public/leaderboard.json",
        help="Output JSON path"
    )

    args = parser.parse_args()

    if not Path(args.input).exists():
        raise FileNotFoundError(
            f"CSV file not found: {args.input}"
        )

    convert_csv_to_json(
        args.input,
        args.output
    )
