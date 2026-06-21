#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "usage: $0 <left-version> <right-version>" >&2
  exit 1
fi

left="${1#v}"
right="${2#v}"

if [[ "$left" == "$right" ]]; then
  echo "eq"
  exit 0
fi

highest=$(printf '%s\n%s\n' "$left" "$right" | sort -V | tail -n1)

if [[ "$highest" == "$left" ]]; then
  echo "gt"
else
  echo "lt"
fi
