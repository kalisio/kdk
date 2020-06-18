#!/bin/sh
dbus-daemon --session --fork
Xvfb :1 -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24" >/dev/null 2>&1 &
export DISPLAY=:1.0
fluxbox >/dev/null 2>&1 &

testcafe ${BROWSERS} --ports 1337,1338 --speed ${SPEED} -s path=/screenshots,takeOnFails=true -r slack "/tests/*.test.js" "$@"

if [ -n $S3_ARTEFACTS_PATH ]; then
    cd /tmp
    tar cf screenshots.tar /screenshots
    aws s3 cp screenshots.tar $S3_ARTEFACTS_PATH
fi
