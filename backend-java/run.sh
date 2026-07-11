#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
SRC_DIR="$ROOT_DIR/backend-java/src/main/java"
OUT_DIR="$ROOT_DIR/backend-java/out"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

find "$SRC_DIR" -name '*.java' | sort > "$OUT_DIR/sources.txt"
javac -encoding UTF-8 -d "$OUT_DIR" @"$OUT_DIR/sources.txt"
java -cp "$OUT_DIR" com.citypilot.parking.CityPilotApplication
