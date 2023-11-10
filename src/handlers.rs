use axum::{extract, http};
use serde::{Serialize, Deserialize};
use sqlx::{FromRow, PgPool};

#[derive(FromRow, Serialize)]
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

#[derive(Debug, Deserialize)]
pub struct CreateStudent {
    name: String,
    photo: String,
    dob: String
}

pub async fn create_student(
    extract::State(pool): extract::State<PgPool>,
    axum::Json(payload): axum::Json<CreateStudent>
) -> Result<(http::StatusCode, axum::Json<Student>), http::StatusCode> {
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
        Ok(_) => Ok((http::StatusCode::CREATED, axum::Json(student))),
        Err(_) => Err(http::StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn read_students(
    extract::State(pool): extract::State<PgPool>
) -> Result<axum::Json<Vec<Student>>, http::StatusCode> {
    let res = sqlx::query_as::<_, Student>("SELECT * FROM students")
        .fetch_all(&pool)
        .await;

    match res {
        Ok(students) => Ok(axum::Json(students)),
        Err(_) => Err(http::StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn update_student(
    extract::State(pool): extract::State<PgPool>,
    extract::Path(id): extract::Path<uuid::Uuid>,
    axum::Json(payload): axum::Json<CreateStudent>
) -> http::StatusCode {
    let res = sqlx::query(
        r#"
        UPDATE students
        SET name = $1, photo = $2, dob = $3
        WHERE id = $4
        "#
    )
    .bind(&payload.name)
    .bind(&payload.photo)
    .bind(&payload.dob)
    .bind(id)
    .execute(&pool)
    .await
    .map(|res| match res.rows_affected() {
        0 => http::StatusCode::NOT_FOUND,
        _ => http::StatusCode::OK
    });

    match res {
        Ok(status) => status,
        Err(_) => http::StatusCode::INTERNAL_SERVER_ERROR
    }
}
