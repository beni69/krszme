mod db;
mod jwt;
mod logger;
#[macro_use]
extern crate log;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use mongodb::{options::ClientOptions, Client};
use std::{env, sync::Mutex};

#[get("/")]
async fn index() -> impl Responder {
    "Hello world!"
}

#[get("/{code}")]
async fn with_code(client: web::Data<Mutex<Client>>, code: web::Path<String>) -> impl Responder {
    let link = db::get_link(&client, &code.to_string()).await;

    if let Err(_) = link {
        return HttpResponse::NotFound().body(format!("{} not found", code));
    }
    let link = link.unwrap();
    let client_ref = client.clone();
    let link_ref = link.clone();
    actix_web::rt::spawn(async move { db::update_link(client_ref, link_ref).await });

    HttpResponse::PermanentRedirect()
        .append_header(("location", link.url))
        .finish()
}

const DEFAULT_PORT: u16 = 8080;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    logger::init_log(Some("actix_web=info,krszme_server=info"));
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
            .service(with_code)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
