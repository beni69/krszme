FROM rust:slim AS builder

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install -y musl-tools musl-dev
RUN update-ca-certificates

ARG APP_NAME="krszme_server"

WORKDIR /src

RUN USER=root cargo init --bin
COPY ./Cargo.* ./
RUN cargo build --target x86_64-unknown-linux-musl --release \ 
    && rm -rf src

ADD . ./
RUN rm ./target/x86_64-unknown-linux-musl/release/deps/${APP_NAME}* \
    && cargo build --target x86_64-unknown-linux-musl --release

FROM scratch
ARG APP_NAME="krszme_server"
COPY --from=builder /src/target/x86_64-unknown-linux-musl/release/${APP_NAME} /app
CMD ["/app"]
