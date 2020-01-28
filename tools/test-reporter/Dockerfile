FROM node:8-buster-slim
LABEL maintainer="contact@kalisio.xyz"

ARG TEST_REPORTER_VERSION=0.7.0

# Install code climate
RUN curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-${TEST_REPORTER_VERSION}-linux-amd64 > ./cc-test-reporter && chmod +x ./cc-test-reporter

# Create the coverage directory and share it as a volume
RUN mkdir /coverage && chmod +w coverage
VOLUME [ "/coverage" ]

# Define the entrypoint
COPY docker-entrypoint.sh /
ENTRYPOINT [ "/docker-entrypoint.sh" ]
