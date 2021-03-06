use actix_web::{HttpResponse, ResponseError};
use reqwest::StatusCode;
use std::fmt::Display;

pub type Result<T> = std::result::Result<T, ApiError>;
pub type Response = Result<HttpResponse>;

#[derive(Debug)]
pub enum ApiError {
    NotFound,
    InternalServerError,
    BadJwt,
    DestInvalid,
    CodeInvalid,
    CodeTaken,
    CodeReserved,
}
impl ApiError {
    pub fn status(&self) -> StatusCode {
        match self {
            ApiError::NotFound => StatusCode::NOT_FOUND,
            ApiError::InternalServerError => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::BadJwt => StatusCode::UNAUTHORIZED,
            ApiError::CodeTaken => StatusCode::CONFLICT,
            ApiError::CodeReserved => StatusCode::CONFLICT,
            _ => StatusCode::BAD_REQUEST,
        }
    }
    pub fn code(&self) -> u16 {
        match self {
            ApiError::NotFound => 404,
            ApiError::InternalServerError => 500,
            ApiError::BadJwt => 10000,
            ApiError::DestInvalid => 10001,
            ApiError::CodeInvalid => 10002,
            ApiError::CodeTaken => 10003,
            ApiError::CodeReserved => 10004,
        }
    }
}
impl Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                ApiError::NotFound => "not found",
                ApiError::InternalServerError => "internal server error",
                ApiError::BadJwt => "Invalid or missing jwt token",
                ApiError::DestInvalid => "Destination invalid",
                ApiError::CodeInvalid => "Code invalid",
                ApiError::CodeTaken => "Code in use",
                ApiError::CodeReserved => "Code is reserved",
            }
        )
    }
}
impl ResponseError for ApiError {
    fn status_code(&self) -> StatusCode {
        self.status()
    }
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status()).body(
            String::new()
                + "{\"error\":true,\"message\":\""
                + &self.to_string()
                + "\",\"code\":"
                + &self.code().to_string()
                + "}",
        )
    }
}
