# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.233.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT="18-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

USER node
# install google cloud sdk
RUN curl https://sdk.cloud.google.com | bash -s -- --disable-prompts && \
    # add google cloud sdk to PATH 
    mkdir -vp $HOME/.local/bin && ln -s $HOME/google-cloud-sdk/bin/* $HOME/.local/bin/ && \
    # install pnpm
    npm i -g pnpm
