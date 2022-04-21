use actix_web::web;
use anyhow::{anyhow, Result};
use mongodb::{bson::doc, Client};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

pub type MongoClient = web::Data<Mutex<Client>>;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Link {
    #[serde(rename = "_id")]
    pub id: String,
    pub clicks: i32,
    pub dest: String,
    pub url: String,
    #[serde(rename = "userID")]
    pub user_id: String,
}

pub async fn get_link(client: &MongoClient, code: &str) -> Result<Link> {
    let client = client.lock().unwrap();
    match client
        .database("krszme-test")
        .collection::<Link>("urls")
        .find_one(doc! { "_id": code }, None)
        .await?
    {
        Some(l) => Ok(l),
        None => Err(anyhow!("Link not found")),
    }
}
pub async fn get_links(client: MongoClient, uid: &str) -> Result<Vec<Link>> {
    let client = client.lock().unwrap();
    let mut links = client
        .database("krszme-test")
        .collection::<Link>("urls")
        .find(doc! { "userID": uid }, None)
        .await?;

    let mut v = Vec::new();
    while links.advance().await? {
        v.push(links.deserialize_current()?);
    }
    Ok(v)
}

pub async fn update_link(client: MongoClient, link: Link) -> Result<()> {
    let client = client.lock().unwrap();
    client
        .database("krszme-test")
        .collection::<Link>("urls")
        .update_one(
            doc! { "_id": link.id.clone() },
            doc! { "$set": {"clicks": link.clicks + 1 } },
            None,
        )
        .await?;
    Ok(())
}
