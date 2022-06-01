#!/bin/sh
set -e

yarn check --verify-tree || yarn install

exec "$@"
