# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.209.6/containers/debian/.devcontainer/base.Dockerfile

# [Choice] Debian version (use bullseye or stretch on local arm64/Apple Silicon): bullseye, buster, stretch
ARG VARIANT="buster"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# ** [Optional] Uncomment this section to install additional packages. **
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

RUN apt-get update -qq && \
  DEBIAN_FRONTEND=noninteractive apt-get install -qqy \
    vim \
    less \
  --no-install-recommends && \
  rm -rf /var/apt/lists*

RUN rm -rf /etc/update-motd.d && \
  mkdir -p /etc/update-motd.d

COPY ./motd.d /etc/update-motd.d
