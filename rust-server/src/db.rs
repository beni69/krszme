use actix_web::web;
use anyhow::{anyhow, Result};
use mongodb::{
    bson::{doc, DateTime},
    Client,
};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

pub type MongoClient = web::Data<Mutex<Client>>;

lazy_static::lazy_static! {
    static ref DB_NAME: String = std::env::var("DB_NAME").unwrap_or("krszme".into());
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Link {
    #[serde(rename = "_id")]
    pub id: String,
    pub clicks: i32,
    pub dest: String,
    pub url: String,
    #[serde(rename = "userID")]
    pub user_id: Option<String>,
    pub timestamp: DateTime,
}
impl Link {
    pub fn json(&self) -> serde_json::Value {
        let mut v = serde_json::to_value(self).unwrap();
        v["timestamp"] = serde_json::Value::String(self.timestamp.to_rfc3339_string());
        v
    }
}
#[derive(Debug, Serialize)]
pub struct LinkTiny {
    #[serde(rename = "_id")]
    pub id: String,
    pub dest: String,
    pub url: String,
}

macro_rules! collection {
    ($client:expr) => {{
        $client
            .lock()
            .unwrap()
            .database(&DB_NAME)
            .collection::<Link>("urls")
    }};
}

pub async fn get_link(client: &MongoClient, code: &str) -> Result<Link> {
    match collection!(client)
        .find_one(doc! { "_id": code }, None)
        .await?
    {
        Some(l) => Ok(l),
        None => Err(anyhow!("Link not found")),
    }
}
pub async fn get_links(client: &MongoClient, uid: &str) -> Result<Vec<Link>> {
    let mut links = collection!(client)
        .find(doc! { "userID": uid }, None)
        .await?;

    let mut v = Vec::new();
    while links.advance().await? {
        v.push(links.deserialize_current()?);
    }
    Ok(v)
}
pub async fn update_link(client: &MongoClient, link: &Link) -> Result<()> {
    collection!(client)
        .update_one(
            doc! { "_id": &link.id },
            doc! { "$set": {"clicks": link.clicks + 1 } },
            None,
        )
        .await?;
    Ok(())
}
pub async fn delete_link(client: &MongoClient, code: &str) -> Result<()> {
    collection!(client)
        .delete_one(doc! { "_id": code }, None)
        .await?;
    Ok(())
}
pub async fn create_link(client: &MongoClient, link: &Link) -> Result<()> {
    collection!(client).insert_one(link, None).await?;
    Ok(())
}
