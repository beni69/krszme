use actix_web::{http::header, HttpRequest};
use anyhow::{anyhow, Result};
use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};
use reqwest::get;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, env, str::FromStr};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub name: String,
    pub picture: String,
    pub user_id: String,
    pub email: String,
    pub email_verified: bool,
    pub firebase: Firebase,
    pub auth_time: usize,
    pub aud: String,
    pub exp: usize,
    pub iat: usize,
    pub iss: String,
    pub sub: String,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Firebase {
    pub identities: HashMap<String, Vec<String>>,
    pub sign_in_provider: String,
}

pub async fn verify(token: &str) -> Result<User> {
    let kid = match decode_header(token).map(|h| h.kid) {
        Ok(Some(header)) => header,
        Err(e) => return Err(e.into()),
        _ => return Err(anyhow!("Invalid token")),
    };

    let key = fetch_jwk(&kid).await?;

    let conf = get_jwk_conf();
    debug!("{conf:#?}");
    let mut v = Validation::new(Algorithm::from_str(&key.alg)?);
    v.set_audience(&[&conf.audience]);
    v.set_issuer(&[&conf.issuer]);
    let user = decode::<User>(
        token,
        &DecodingKey::from_rsa_components(&key.n, &key.e)?,
        &v,
    );

    Ok(user?.claims)
}

pub async fn auth_optional(req: &HttpRequest) -> Option<User> {
    let auth = match req.headers().get(header::AUTHORIZATION) {
        Some(h) => match h.to_str() {
            Ok(s) => s,
            Err(_) => return None,
        },
        None => return None,
    };
    let mut auth = auth.split_whitespace();
    let prefix = match auth.next() {
        Some(x) => x,
        None => return None,
    };
    if prefix != "firebase" {
        return None;
    }
    let jwt = match auth.next() {
        Some(x) => x,
        None => return None,
    };
    match verify(jwt).await {
        Ok(u) => Some(u),
        Err(_) => None,
    }
}

#[macro_export]
macro_rules! auth_force {
    ($token:expr) => {{
        match crate::jwt::auth_optional(&$token).await {
            Some(u) => u,
            None => return Err(crate::ApiError::BadJwt),
        }
    }};
}

#[derive(Debug)]
pub struct JwkConfig {
    pub jwk_url: String,
    pub audience: String,
    pub issuer: String,
}
fn env_or_default(key: &str, default: &str) -> String {
    env::var(key).unwrap_or_else(|_| default.into())
}
pub fn get_jwk_conf() -> JwkConfig {
    JwkConfig {
        jwk_url: env_or_default("JWK_URL", "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
        audience: env_or_default("JWK_AUDIENCE", "krszme"),
        issuer: env_or_default("JWK_ISSUER", "https://securetoken.google.com/krszme")
    }
}

#[derive(Debug, Deserialize, Clone)]
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

async fn fetch_jwk(kid: &str) -> Result<JwkKey> {
    let jwk_conf = get_jwk_conf();
    let res = get(&jwk_conf.jwk_url).await?;
    debug!("status: {}", res.status());
    let body = res.json::<KeyResponse>().await?;
    match body.keys.iter().find(|k| k.kid == kid) {
        Some(k) => Ok(k.clone()),
        None => Err(anyhow!("public key not found")),
    }
}
