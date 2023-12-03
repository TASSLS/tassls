use axum::{extract, http};
use serde::{Serialize, Deserialize};
use sqlx::{FromRow, PgPool};

#[derive(FromRow, Serialize)]
pub struct Student {
    id: uuid::Uuid,
    username: String,
    password: String,
    name: String,
    gender: bool,
    photo: String,
    dob: chrono::DateTime<chrono::Utc>,
    created: chrono::DateTime<chrono::Utc>,
    updated: chrono::DateTime<chrono::Utc>,
    timetable_id: uuid::Uuid
}

#[derive(Debug, Deserialize)]
pub struct CreateInitialStudent {
    username: String,
    password: String,
    name: String,
    gender: bool,
    photo: String,
    timetable_id: uuid::Uuid
}

#[derive(Debug, Deserialize)]
pub struct CreateStudent {
    username: String,
    password: String,
    name: String,
    photo: String,
}

impl Student {
    fn new(student: CreateInitialStudent) -> Self {
        let id = uuid::Uuid::new_v4();
        let now = chrono::Utc::now();
        Self {
            id,
            username: student.username,
            password: student.password,
            name: student.name,
            gender: student.gender,
            photo: student.photo,
            dob: now,
            created: now,
            updated: now,
            timetable_id: student.timetable_id
        }
    }
}

pub async fn create_student(
    extract::State(pool): extract::State<PgPool>,
    axum::Json(payload): axum::Json<CreateInitialStudent>
) -> Result<(http::StatusCode, axum::Json<Student>), http::StatusCode> {
    let student = Student::new(payload);
    let res = sqlx::query(
        r#"
        INSERT INTO students (id, username, password, name, gender, photo, dob, created, updated, timetable_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        "#
    )
    .bind(student.id)
    .bind(&student.username)
    .bind(&student.password)
    .bind(&student.name)
    .bind(student.gender)
    .bind(&student.photo)
    .bind(&student.dob)
    .bind(&student.created)
    .bind(&student.updated)
    .bind(student.timetable_id)
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

pub async fn read_students_name(
    extract::State(pool): extract::State<PgPool>,
    extract::Path(username): extract::Path<String>
) -> Result<axum::Json<Vec<Student>>, http::StatusCode> {
    let res = sqlx::query_as::<_, Student>(r#"SELECT * FROM students
                                           WHERE username = $1"#)
        .bind(&username)
        .fetch_all(&pool)
        .await;

    match res {
        Ok(students) => Ok(axum::Json(students)),
        Err(_) => Err(http::StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn read_students_id(
    extract::State(pool): extract::State<PgPool>,
    extract::Path(id): extract::Path<uuid::Uuid>
) -> Result<axum::Json<Vec<Student>>, http::StatusCode> {
    let res = sqlx::query_as::<_, Student>(
        r#"SELECT * FROM students
        WHERE id = $1
        "#
    )
    .bind(id)
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
        SET username = $1, password = $2, name = $3, photo = $4, updated = $5
        WHERE id = $6
        "#
    )
    .bind(&payload.username)
    .bind(&payload.password)
    .bind(&payload.name)
    .bind(&payload.photo)
    .bind(chrono::Utc::now())
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

pub async fn delete_student(
    extract::State(pool): extract::State<PgPool>,
    extract::Path(id): extract::Path<uuid::Uuid>,
) -> http::StatusCode {
    let res = sqlx::query(
        r#"
        DELETE FROM students
        WHERE id = $1
        "#
    )
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
