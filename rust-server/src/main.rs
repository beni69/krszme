mod apierror;
mod db;
mod jwt;
mod logger;
#[macro_use]
extern crate log;
use crate::{
    apierror::{ApiError, Response},
    db::{create_link, delete_link, get_link, get_links, update_link, Link, LinkTiny, MongoClient},
    jwt::auth_optional,
};
use actix_cors::Cors;
use actix_web::{delete, get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use mongodb::{options::ClientOptions, Client};
use nanoid::nanoid;
use regex::Regex;
use serde::Deserialize;
use std::{env, sync::Mutex};

#[get("/")]
async fn index() -> impl Responder {
    "Hello world!"
}

#[get("/api/user/me")]
async fn user_me(req: HttpRequest) -> Response {
    Ok(HttpResponse::Ok().json(auth_force!(req)))
}

#[get("/api/url/me")]
async fn url_me(client: MongoClient, req: HttpRequest) -> Response {
    let user = auth_force!(req);
    let links = get_links(&client, &user.user_id).await.unwrap();
    Ok(HttpResponse::Ok().json(links))
}

#[get("/api/url/{code}")]
async fn get_url_code(client: MongoClient, code: web::Path<String>, req: HttpRequest) -> Response {
    let user = auth_optional(&req).await;
    let link = match get_link(&client, &code).await {
        Ok(link) => link,
        Err(_) => return Err(ApiError::NotFound),
    };

    if user.is_some()
        && link.user_id.is_some()
        && user.unwrap().user_id == link.user_id.clone().unwrap()
    {
        Ok(HttpResponse::Ok().json(link))
    } else {
        Ok(HttpResponse::Ok().json(LinkTiny {
            id: link.id,
            dest: link.dest,
            url: link.url,
        }))
    }
}

#[delete("/api/url/{code}")]
async fn delete_url_code(
    client: MongoClient,
    code: web::Path<String>,
    req: HttpRequest,
) -> Response {
    let user = auth_force!(req);
    let link = match get_link(&client, &code).await {
        Ok(link) => link,
        Err(_) => return Err(ApiError::NotFound),
    };
    if link.user_id.is_some() && user.user_id == link.user_id.clone().unwrap() {
        if let Err(_) = delete_link(&client, &code).await {
            return Err(ApiError::InternalServerError);
        }
        Ok(HttpResponse::Ok().json(link))
    } else {
        Err(ApiError::BadJwt)
    }
}

#[derive(Debug, Deserialize)]
struct CreateLinkData {
    dest: Option<String>,
    code: Option<String>,
}
#[post("/api/url/create")]
async fn post_create_link(
    client: MongoClient,
    req: HttpRequest,
    data: web::Json<CreateLinkData>,
) -> Response {
    let data = data.0;
    debug!("{data:#?}");
    let dest = match data.dest {
        Some(dest) => dest,
        None => return Err(ApiError::DestInvalid),
    };
    if !URL_RE.is_match(&dest) {
        return Err(ApiError::DestInvalid);
    }

    let code: String = if let Some(code) = data.code {
        if RESERVED_WORDS.iter().any(|x| x == &code) {
            return Err(ApiError::CodeReserved);
        }
        if !CODE_RE.is_match(&code) {
            return Err(ApiError::CodeInvalid);
        }
        if get_link(&client, &code).await.is_ok() {
            return Err(ApiError::CodeTaken);
        }
        code
    } else {
        let mut code: String;
        loop {
            code = nanoid!(CODE_LENGTH, ALPHABET);
            if get_link(&client, &code).await.is_err() {
                break;
            }
        }
        code
    };

    let user = auth_optional(&req).await;
    let user_id = match user {
        Some(user) => Some(user.user_id),
        None => None,
    };
    let link = Link {
        url: format!("{}/{}", BASE_URL.as_str(), &code),
        id: code,
        dest,
        user_id,
        clicks: 0,
    };

    match create_link(&client, &link).await {
        Ok(_) => Ok(HttpResponse::Ok().json(link)),
        Err(_) => Err(ApiError::InternalServerError),
    }
}

#[get("/{code}")]
async fn with_code(client: MongoClient, code: web::Path<String>) -> impl Responder {
    let link = match get_link(&client, &code).await {
        Ok(link) => link,
        Err(_) => return HttpResponse::NotFound().body(format!("{code} not found")),
    };

    // this way we don't have to wait for the db update before redirecting
    let client_ref = client.clone();
    let link_ref = link.clone();
    actix_web::rt::spawn(async move { update_link(&client_ref, &link_ref).await });

    HttpResponse::PermanentRedirect()
        .append_header(("location", link.dest))
        .finish()
}

const DEFAULT_PORT: u16 = 8080;
const RESERVED_WORDS: &[&str] = &[
    "api", "app", "home", "login", "me", "signin", "signup", "test", "url", "user",
];
const ALPHABET: &[char] = &[
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
    'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z',
];
const CODE_LENGTH: usize = 5;
lazy_static::lazy_static! {
    static ref CODE_RE: Regex = Regex::new(r"^[\w\d\.]{3,32}$").unwrap();
    static ref URL_RE: Regex = Regex::new(r"^(http|https)://((\\w)*|([0-9]*)|([-|_])*)+([\\.|/]((\\w)*|([0-9]*)|([-|_])*))+$").unwrap();
    static ref BASE_URL: String = env::var("BASE_URL").unwrap_or("https://krsz.me".into());
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    logger::init_log(Some("actix_web=info,krszme_server=debug"));
    let port: u16 = env::var("PORT")
        .unwrap_or(DEFAULT_PORT.to_string())
        .parse()
        .unwrap_or(DEFAULT_PORT);
    let conn_str = env::var("MONGODB").expect("MONGODB must be set");

    let client_options = ClientOptions::parse(conn_str).await.unwrap();
    let client = web::Data::new(Mutex::new(Client::with_options(client_options).unwrap()));

    {
        info!("Starting server: http://localhost:{port}");
        let client = client.lock().unwrap();
        info!(
            "Connected to MongoDB: {:?}",
            client.list_database_names(None, None).await.unwrap()
        );
    }

    HttpServer::new(move || {
        App::new()
            .app_data(client.clone())
            .wrap(logger::actix_log())
            .wrap(Cors::default().supports_credentials())
            .service(index)
            .service(user_me)
            .service(url_me)
            .service(get_url_code)
            .service(delete_url_code)
            .service(post_create_link)
            .service(with_code)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
