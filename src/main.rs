use std::error::Error;
use axum::routing::{get, post, put, delete, Router};

mod handlers;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    start_db_connection().await?;

    Ok(())
}

async fn start_db_connection() -> Result<(), Box<dyn Error>> {
    let url = std::env::var("DATABASE_URL").expect("need a database to connect to");
    let pool = sqlx::postgres::PgPool::connect(&url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    start_server(pool).await?;

    Ok(())
}

async fn start_server(pool: sqlx::PgPool) -> Result<(), Box<dyn Error>> {
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);

    println!("server running at: {}", addr);

    let app = Router::new()
        .route("/students", post(handlers::create_student))
        .route("/students", get(handlers::read_students))
        .route("/students/:id", put(handlers::update_student))
        .route("/students/:id", delete(handlers::delete_student))
        .with_state(pool);

    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}
