#!/usr/bin/env bash
file=$(jq -r '.tool_input.file_path // ""')

if ! echo "$file" | grep -qE '\.(ts|tsx)$'; then
  exit 0
fi

output=$(bun run lint 2>&1)
code=$?

if [ "$code" -eq 0 ]; then
  exit 0
fi

context=$(printf '%s' "$output" | tail -n +2 | jq -Rs .)
printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":%s}}' "$context"
