#!/bin/sh
set -e

# Wait for the app
until nc -z -v -w30 web 3000; do
  echo 'Waiting for web server...'
  sleep 1
done
echo "Web server is up and running!"

exec "$@"
