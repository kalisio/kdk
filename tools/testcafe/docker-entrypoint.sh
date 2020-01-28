#!/bin/sh
dbus-daemon --session --fork
Xvfb :1 -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24" >/dev/null 2>&1 &
export DISPLAY=:1.0
fluxbox >/dev/null 2>&1 &

testcafe ${BROWSER} --ports 1337,1338 --speed ${SPEED} -S -s /screenshots -r slack "/tests/*.test.js" "$@"

      