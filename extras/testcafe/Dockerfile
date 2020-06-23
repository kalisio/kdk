FROM alpine:edge

ARG TESTCAFE_VERSION=1.8.6
ARG TESTCAFE_VUE_SELECTORS_VERSION=3.1.0
ARG MONGODB_DRIVER_VERSION=3.1.4
ARG PIXELMATCH_VERSION=5.2.0
ARG PNGJS_VERSION=5.0.0
ARG TESTCAFE_BROWSERS="firefox:headless"
ARG TESTCAFE_SPEED=0.75
ARG TESTCAFE_SCREEN_WIDTH=1024
ARG TESTCAFE_SCREEN_HEIGHT=720

RUN \
  apk --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/ --repository http://dl-cdn.alpinelinux.org/alpine/v3.10/main/ upgrade && \
  apk --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/ --repository http://dl-cdn.alpinelinux.org/alpine/v3.10/main/ add \
  libevent nodejs npm chromium firefox-esr xwininfo xvfb dbus eudev ttf-freefont fluxbox procps curl unzip bash vim && \
  cd /tmp && curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip && unzip rclone-current-linux-amd64.zip && \
  cp /tmp/rclone-*-linux-amd64/rclone /usr/bin && rm -r /tmp/rclone*

WORKDIR /opt/testcafe
RUN adduser -D -h /opt/testcafe user
USER user

RUN npm install \
    testcafe@${TESTCAFE_VERSION} \
    testcafe-vue-selectors@${TESTCAFE_VUE_SELECTORS_VERSION} \
    testcafe-reporter-slack \
    mongodb@${MONGODB_DRIVER_VERSION} \
    pixelmatch@${PIXELMATCH_VERSION} \
    pngjs@${PNGJS_VERSION} \
    && npm cache clean --force \
    && rm -rf /tmp/*

ENV NODE_PATH=/opt/testcafe/node_modules
ENV PATH=${PATH}:/opt/testcafe/node_modules/.bin

USER root
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENV SCREEN_WIDTH=${TESTCAFE_SCREEN_WIDTH}
ENV SCREEN_HEIGHT=${TESTCAFE_SCREEN_HEIGHT}
ENV BROWSERS=${TESTCAFE_BROWSERS}
ENV SPEED=${TESTCAFE_SPEED}

EXPOSE 1337 1338
USER user
ENTRYPOINT [ "/docker-entrypoint.sh" ]
