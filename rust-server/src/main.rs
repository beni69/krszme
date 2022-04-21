mod apierror;
mod db;
mod jwt;
mod logger;
#[macro_use]
extern crate log;
use crate::{
    apierror::{ApiError, Response},
    db::{get_link, get_links, update_link, MongoClient},
    jwt::verify,
};
use actix_web::{get, http::header, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use mongodb::{options::ClientOptions, Client};
use std::{env, sync::Mutex};

#[get("/")]
async fn index() -> impl Responder {
    "Hello world!"
}

#[get("/user/me")]
async fn user_me(req: HttpRequest) -> Response {
    Ok(HttpResponse::Ok().json(verify_req!(req)))
}

#[get("/url/me")]
async fn url_me(client: MongoClient, req: HttpRequest) -> Response {
    let user = verify_req!(req);
    let links = get_links(client, &user.user_id).await.unwrap();
    Ok(HttpResponse::Ok().json(links))
}

// TODO: implement more routes
// #[get("/url/{code}")]
// #[delete("/url/{code}")]
// #[post("/url/create")]

#[get("/{code}")]
async fn with_code(client: MongoClient, code: web::Path<String>) -> impl Responder {
    let link = match get_link(&client, &code.to_string()).await {
        Ok(link) => link,
        Err(_) => return HttpResponse::NotFound().body(format!("{code} not found")),
    };

    // this way we don't have to wait for the db update before redirecting
    let client_ref = client.clone();
    let link_ref = link.clone();
    actix_web::rt::spawn(async move { update_link(client_ref, link_ref).await });

    HttpResponse::PermanentRedirect()
        .append_header(("location", link.dest))
        .finish()
}

const DEFAULT_PORT: u16 = 8080;

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
            .service(index)
            .service(user_me)
            .service(url_me)
            .service(with_code)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
