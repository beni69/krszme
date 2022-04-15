use actix_web::web;
use mongodb::{
    bson::{self, doc, Bson, Document},
    Client,
};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug)]
pub enum DbError {
    MongoError(mongodb::error::Error),
    NotFound,
}
impl From<mongodb::error::Error> for DbError {
    fn from(err: mongodb::error::Error) -> Self {
        DbError::MongoError(err)
    }
}
impl From<mongodb::bson::de::Error> for DbError {
    fn from(err: mongodb::bson::de::Error) -> Self {
        DbError::MongoError(err.into())
    }
}
pub type DbResult<T> = Result<T, DbError>;

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

pub async fn get_link(client: &web::Data<Mutex<Client>>, code: &String) -> DbResult<Link> {
    let client = client.lock().unwrap();
    let link: Document = match client
        .database("krszme-test")
        .collection("urls")
        .find_one(doc! { "_id": code }, None)
        .await?
    {
        Some(doc) => doc,
        None => return Err(DbError::NotFound),
    };
    Ok(bson::from_bson(Bson::Document(link))?)
}

pub async fn update_link(client: web::Data<Mutex<Client>>, link: Link) -> DbResult<()> {
    let client = client.lock().unwrap();
    client
        .database("krszme-test")
        .collection::<Document>("urls")
        .update_one(
            doc! { "_id": link.id.clone() },
            doc! { "$set": {"clicks": link.clicks + 1 } },
            None,
        )
        .await?;
    Ok(())
}
