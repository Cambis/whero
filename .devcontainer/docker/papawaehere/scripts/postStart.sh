#!/bin/bash

set -x

if [ ! -f "$HOME/.motd-updated" ]; then
  echo "run-parts /etc/update-motd.d" >> "$HOME/.bashrc"
  echo "run-parts /etc/update-motd.d" >> "$HOME/.zshrc"
  # Mark first run notice as displayed after 10s to avoid problems with fast terminal refreshes hiding it
  sleep 10s
  touch "$HOME/.motd-updated"
fi

exit
