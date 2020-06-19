#!/bin/sh

dbus-daemon --session --fork
Xvfb :1 -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24" >/dev/null 2>&1 &
export DISPLAY=:1.0
fluxbox >/dev/null 2>&1 &

testcafe ${BROWSERS} --ports 1337,1338 --skip-js-errors --speed ${SPEED} -s path=/tmp/screenshots,takeOnFails=true -r spec,slack "/tests/*.test.js" "$@"
RESULT=$?

# Upload screenshots somewhere ?
if [ -n "$SCREENSHOTS_RCLONE_PATH" ]; then
    cd /tmp
    tar cf screenshots.tar /tmp/screenshots
    rclone copy screenshots.tar $SCREENSHOTS_RCLONE_PATH
    if [ -n "$TESTCAFE_SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' --data '{"text":"Test run screenshots were copied here: $SCREENSHOTS_RCLONE_PATH"}' $TESTCAFE_SLACK_WEBHOOK
    fi
fi

exit $RESULT
