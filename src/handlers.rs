use axum::{extract, http};
use serde::Deserialize;
use sqlx::PgPool;

#[derive(Debug, Deserialize)]
pub struct Student {
    id: uuid::Uuid,
    name: String,
    photo: String,
    dob: String
}

impl Student {
    fn new(
        name: String,
        photo: String,
        dob: String
    ) -> Self {
        let id = uuid::Uuid::new_v4();
        Self {
            id,
            name,
            photo,
            dob
        }
    }
}

pub async fn health() -> http::StatusCode {
    http::StatusCode::OK
}

pub async fn create_student(
    extract::State(pool): extract::State<PgPool>,
    axum::Json(payload): axum::Json<Student>
) -> Result<http::StatusCode, http::StatusCode> {
    let student = Student::new(payload.name, payload.photo, payload.dob);

    let res = sqlx::query(
        r#"
        INSERT INTO students (id, name, photo, dob)
        VALUES ($1, $2, $3, $4)
        "#
        )
    .bind(&student.id)
    .bind(&student.name)
    .bind(&student.photo)
    .bind(&student.dob)
    .execute(&pool)
    .await;

    match res {
        Ok(_) => Ok(http::StatusCode::CREATED),
        Err(_) => Err(http::StatusCode::INTERNAL_SERVER_ERROR)
    }
}
