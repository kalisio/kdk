#!/bin/sh

dbus-daemon --session --fork
Xvfb :1 -screen 0 "${SCREEN_WIDTH}x${SCREEN_HEIGHT}x24" >/dev/null 2>&1 &
export DISPLAY=:1.0
fluxbox >/dev/null 2>&1 &

testcafe ${BROWSERS} --ports 1337,1338 --skip-js-errors --speed ${SPEED} -s path=screenshots,takeOnFails=true -r spec,slack "/tests/*.test.js" "$@" 2>&1 > /tmp/testcafe.log
RESULT=$?

# Upload artefacts somewhere ?
if [ -n "$BUILD_BUCKET" ]; then
    # testcafe test log
    rclone copy /tmp/testcafe.log $BUILD_BUCKET

    # screenshots
    tar cf /tmp/screenshots.tar screenshots
    rclone copy /tmp/screenshots.tar $BUILD_BUCKET

    # notify on slack
    if [ -n "$TESTCAFE_SLACK_WEBHOOK" ]; then
        PAYLOAD=$(printf '{"text":"Test artefacts uploaded here: %s"}' $BUILD_BUCKET)
        curl -X POST -H 'Content-type: application/json' --data "$PAYLOAD" $TESTCAFE_SLACK_WEBHOOK
    fi
fi

exit $RESULT
