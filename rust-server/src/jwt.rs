use actix_http::{encoding::Decoder, header::HeaderValue, Payload};
use awc::ClientResponse;
use jsonwebtoken::decode_header;
use serde::{Deserialize, Serialize};
use std::{env, time::Duration};

const DEFAULT_TIMEOUT: Duration = Duration::from_secs(60);

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct User {
    name: String,
    picture: String,
    user_id: String,
    aud: String,
    exp: usize,
    iat: usize,
    iss: String,
    sub: String,
}

pub fn verify(token: &str) -> Option<User> {
    let header = match decode_header(token).map(|h| h.kid) {
        Ok(Some(header)) => header,
        _ => return None,
    };

    // TODO: get public key from google
    // store it in a global, probably the web server state
    // refetch when cache expires
    // https://github.com/maylukas/rust_jwk_example

    None
}

pub struct JwkConfig {
    pub jwk_url: String,
    pub audience: String,
    pub issuer: String,
}
fn env_or_default(key: &str, default: &str) -> String {
    env::var(key).unwrap_or(default.into())
}
pub fn get_jwk_conf() -> JwkConfig {
    JwkConfig {
        jwk_url: env_or_default("JWK_URL", "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
        audience: env_or_default("JWK_AUDIENCE", "krszme"),
        issuer: env_or_default("JWK_ISSUER", "https://securetoken.google.com/krszme")
    }
}

#[derive(Debug, Serialize, Deserialize, Eq, PartialEq)]
pub struct JwkKey {
    pub e: String,
    pub alg: String,
    pub kty: String,
    pub kid: String,
    pub n: String,
}

#[derive(Debug, Deserialize)]
struct KeyResponse {
    keys: Vec<JwkKey>,
}

pub enum MaxAgeParseError {
    NoMaxAgeSpecified,
    NoCacheControlHeader,
    MaxAgeValueEmpty,
    NonNumericMaxAge,
}

type Response = ClientResponse<Decoder<Payload>>;

// Determines the max age of an HTTP response
pub fn get_max_age(response: &Response) -> Result<Duration, MaxAgeParseError> {
    let headers = response.headers();
    let header = headers.get("Cache-Control");

    match header {
        Some(header_value) => parse_cache_control_header(header_value),
        None => Err(MaxAgeParseError::NoCacheControlHeader),
    }
}

fn parse_max_age_value(cache_control_value: &str) -> Result<Duration, MaxAgeParseError> {
    let tokens: Vec<&str> = cache_control_value.split(",").collect();
    for token in tokens {
        let key_value: Vec<&str> = token.split("=").map(|s| s.trim()).collect();
        let key = key_value.first().unwrap();
        let val = key_value.get(1);

        if String::from("max-age").eq(&key.to_lowercase()) {
            match val {
                Some(value) => {
                    return Ok(Duration::from_secs(
                        value
                            .parse()
                            .map_err(|_| MaxAgeParseError::NonNumericMaxAge)?,
                    ))
                }
                None => return Err(MaxAgeParseError::MaxAgeValueEmpty),
            }
        }
    }
    return Err(MaxAgeParseError::NoMaxAgeSpecified);
}

fn parse_cache_control_header(header_value: &HeaderValue) -> Result<Duration, MaxAgeParseError> {
    match header_value.to_str() {
        Ok(string_value) => parse_max_age_value(string_value),
        Err(_) => Err(MaxAgeParseError::NoCacheControlHeader),
    }
}
