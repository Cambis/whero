FROM ruby:2.6.3-alpine
LABEL maintainer="Cameron Bryers <www.cameronbryers.dev>"

ENV MAILCATCHER_VERSION 0.6.5

RUN apk add --no-cache --virtual build-dependencies \
    build-base \
    ruby-dev \
  && apk add --no-cache \
    libstdc++ \
    sqlite-dev \
  && gem install mailcatcher -v $MAILCATCHER_VERSION --quiet --no-document --norc \
  && apk del build-dependencies

EXPOSE 1080 1025

ENV HTTP_PORT 1080
ENV SMTP_PORT 1025

COPY run.sh /run.sh
RUN chmod +x /run.sh

CMD [ "/run.sh" ]
