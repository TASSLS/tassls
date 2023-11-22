use axum::{extract, http};
use serde::{Serialize, Deserialize};
use sqlx::{FromRow, PgPool};

#[derive(Deserialize)]
pub struct CreatePeriod {
    subject: String,
    room: String,
    teacher: String
}

pub struct Period {
    id: uuid::Uuid,
    create_period: CreatePeriod
}

pub struct CreateDay {
    periods: [Period; 10],
}

pub struct Day {
    id: uuid::Uuid,
    create_day: CreateDay
}

pub struct CreateWeek {
    days:[Day; 5]
}

pub struct Week {
    id: uuid::Uuid,
    create_week: CreateWeek
}

pub struct CreateTimetable {
    weeks: [Week; 2]
}

pub struct Timetable {
    id: uuid::Uuid,
    create_timetable: CreateTimetable
}

// TODO: perform all timetable operations atomically
async fn create_day(
    periods: &[CreatePeriod],
    pool: &PgPool,
) -> Result<uuid::Uuid, http::StatusCode> {
    let mut period_id: [uuid::Uuid; 10] = Default::default();
    let mut tx = pool.begin().await.unwrap();

    // whyyyy can we not use an array value to bind with????
    for (i, period) in periods.iter().enumerate() {
        let id = uuid::Uuid::new_v4();
        period_id[i] = id;
        if let Err(_) = sqlx::query(
            r#"
            INSERT INTO period (id, subject, room, teacher)
            VALUES ($1, $2, $3, $4)
            "#
        )
        .bind(id)
        .bind(&period.subject)
        .bind(&period.room)
        .bind(&period.teacher)
        .execute(&mut *tx)
        .await {
            tx.rollback()
                .await
                .expect("Failed to rollback transaction");
            return Err(http::StatusCode::INTERNAL_SERVER_ERROR);
        }
    }

    let day_id = uuid::Uuid::new_v4();
    if let Err(_) = sqlx::query(
        r#"
        INSERT INTO day (id, period_1, period_2, period_3, period_4, period_5, period_6, period_7, period_8, period_9, period_10)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
        "#
    )
    .bind(day_id)
    .bind(period_id[0])
    .bind(period_id[1])
    .bind(period_id[2])
    .bind(period_id[3])
    .bind(period_id[4])
    .bind(period_id[5])
    .bind(period_id[6])
    .bind(period_id[7])
    .bind(period_id[8])
    .bind(period_id[9])
    .execute(&mut *tx)
    .await {
        tx.rollback()
            .await
            .expect("Failed to rollback transaction");
        return Err(http::StatusCode::INTERNAL_SERVER_ERROR);
    }
    tx.commit().await.expect("Failed to commit transaction");

    Ok(day_id)
}

async fn create_week(
    days: &[uuid::Uuid],
    pool: &PgPool
) -> Result<uuid::Uuid, http::StatusCode> {
    let week_id = uuid::Uuid::new_v4();
    if let Err(_) = sqlx::query(
        r#"
        INSERT INTO week (id, day_1, day_2, day_3, day_4, day_5)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#
    )
    .bind(&week_id)
    .bind(days[0])
    .bind(days[1])
    .bind(days[2])
    .bind(days[3])
    .bind(days[4])
    .execute(pool)
    .await {
        return Err(http::StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(week_id)
}

#[derive(Deserialize)]
pub struct PayloadData {
    data: Vec<CreatePeriod>
}

pub async fn create_timetable(
    extract::State(pool): extract::State<PgPool>,
    axum::Json(payload): axum::Json<PayloadData>
) -> Result<(http::StatusCode, axum::Json<uuid::Uuid>), http::StatusCode> {
    let mut days: [uuid::Uuid; 10] = Default::default();
    for (i, day) in payload.data.chunks_exact(10).enumerate() {
        days[i] = match create_day(day, &pool).await {
            Ok(id) => id,
            Err(status) => return Err(status)
        }
    }

    let mut weeks: [uuid::Uuid; 2] = Default::default();
    for i in 0..2 {
        weeks[i] = match create_week(&days[5*i..5*(1+i)], &pool).await {
            Ok(id) => id,
            Err(status) => return Err(status)
        };
    }

    let timetable = uuid::Uuid::new_v4();
    match sqlx::query(
        r#"
        INSERT INTO timetable (id, week_1, week_2)
        VALUES ($1, $2, $3)
        "#
    )
    .bind(timetable)
    .bind(weeks[0])
    .bind(weeks[1])
    .execute(&pool)
    .await {
        Ok(_) => Ok((http::StatusCode::CREATED, axum::Json(timetable))),
        Err(_) => Err(http::StatusCode::INTERNAL_SERVER_ERROR)
    }
}
