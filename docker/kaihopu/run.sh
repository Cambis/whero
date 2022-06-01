#!/bin/sh
set -e

mailcatcher --smtp-ip=0.0.0.0 --http-ip=0.0.0.0 --http-port=$HTTP_PORT --smtp-port=$SMTP_PORT --foreground
