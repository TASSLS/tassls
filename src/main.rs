use std::error::Error;
use axum::routing::{get, post, put, delete, Router};
use tower_http::cors::CorsLayer;

mod student;
mod timetable;

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
        .route("/students", post(student::create_student))
        .route("/students", get(student::read_students))
        .route("/students/part/:username", get(student::read_students_name))
        .route("/students/dao/:id", get(student::read_students_id))
        .route("/students/:id", put(student::update_student))
        .route("/students/:id", delete(student::delete_student))
        .route("/timetable", post(timetable::create_timetable))

        .layer(CorsLayer::permissive())
        .with_state(pool);

    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}
