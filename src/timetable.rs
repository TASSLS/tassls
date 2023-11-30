use axum::{extract, http};
use serde::{Serialize, Deserialize};
use sqlx::{FromRow, PgPool};

#[derive(FromRow, Deserialize, Serialize, Clone)]
pub struct CreatePeriod {
    subject: String,
    room: String,
    teacher: String
}

// cant use CreatePeriod in Period because it cant deserialise 2 structs from json i think
#[derive(FromRow, Serialize)]
pub struct Period {
    id: uuid::Uuid,
    subject: String,
    room: String,
    teacher: String
}

#[derive(FromRow, Serialize)]
pub struct Day {
    id: uuid::Uuid,
    period_1: uuid::Uuid,
    period_2: uuid::Uuid,
    period_3: uuid::Uuid,
    period_4: uuid::Uuid,
    period_5: uuid::Uuid,
    period_6: uuid::Uuid,
    period_7: uuid::Uuid,
    period_8: uuid::Uuid,
    period_9: uuid::Uuid,
    period_10: uuid::Uuid
}

#[derive(FromRow, Serialize)]
pub struct Week {
    id: uuid::Uuid,
    day_1: uuid::Uuid,
    day_2: uuid::Uuid,
    day_3: uuid::Uuid,
    day_4: uuid::Uuid,
    day_5: uuid::Uuid
}

#[derive(FromRow, Serialize)]
pub struct Timetable {
    id: uuid::Uuid,
    week_1: uuid::Uuid,
    week_2: uuid::Uuid
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
    .bind(week_id)
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

#[derive(Deserialize, Serialize)]
pub struct CreatePeriodData {
    data: Vec<CreatePeriod>
}

pub async fn create_timetable(
    extract::State(pool): extract::State<PgPool>,
    axum::Json(payload): axum::Json<CreatePeriodData>
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

    let timetable_id = uuid::Uuid::new_v4();
    match sqlx::query(
        r#"
        INSERT INTO timetable (id, week_1, week_2)
        VALUES ($1, $2, $3)
        "#
    )
    .bind(timetable_id)
    .bind(weeks[0])
    .bind(weeks[1])
    .execute(&pool)
    .await {
        Ok(_) => Ok((http::StatusCode::CREATED, axum::Json(timetable_id))),
        Err(_) => Err(http::StatusCode::INTERNAL_SERVER_ERROR)
    }
}

pub async fn read_timetable(
    extract::State(pool): extract::State<PgPool>,
    extract::Path(id): extract::Path<uuid::Uuid>
) -> Result<axum::Json<CreatePeriodData>, http::StatusCode> {
    let timetable = match sqlx::query_as::<_, Timetable>(
        r#"
        SELECT * FROM timetable
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_all(&pool)
    .await {
        Ok(timetable) => timetable,
        Err(_) => return Err(http::StatusCode::INTERNAL_SERVER_ERROR)
    };

    // should be exactly 1 result returned from db queries so constant indexing is safe
    let mut days: [[uuid::Uuid; 5]; 2] = Default::default();
    let timetable_weeks = [timetable[0].week_1, timetable[0].week_2];
    for i in 0..2 {
        days[i] = match sqlx::query_as::<_, Week>(
            r#"
            SELECT * FROM week
            WHERE id = $1
            "#
        )
        .bind(timetable_weeks[i])
        .fetch_all(&pool)
        .await {
            Ok(week) => [week[0].day_1, week[0].day_2, week[0].day_3, week[0].day_4, week[0].day_5],
            Err(_) => return Err(http::StatusCode::INTERNAL_SERVER_ERROR)
        };
    }

    // 10 days of 10 periods
    let mut periods: [[uuid::Uuid; 10]; 10] = Default::default();
    let mut curr_period = 0;
    for i in 0..2 {
        for j in 0..5 {
            periods[curr_period] = match sqlx::query_as::<_, Day>(
                r#"
                SELECT * FROM day
                WHERE id = $1
                "#
            )
            .bind(days[i][j])
            .fetch_all(&pool)
            .await {
                Ok(day) => [day[0].period_1, day[0].period_2, day[0].period_3, day[0].period_4, day[0].period_5, day[0].period_6, day[0].period_7, day[0].period_8, day[0].period_9, day[0].period_10],
                Err(_) => return Err(http::StatusCode::INTERNAL_SERVER_ERROR)
            };
            curr_period += 1;
        }
    }
    curr_period = 0;

    let mut period_data: Vec<CreatePeriod> = Vec::with_capacity(10*10);
    for i in 0..10 {
        for j in 0..10 {
            period_data.push(match sqlx::query_as::<_, CreatePeriod>(
                r#"
                SELECT * FROM period
                WHERE id = $1
                "#
            )
            .bind(periods[i][j])
            .fetch_all(&pool)
            .await {
                Ok(period) => CreatePeriod { // because period id is also returned
                    subject: period[0].subject.clone(),
                    room: period[0].room.clone(),
                    teacher: period[0].teacher.clone(),
                },
                Err(_) => return Err(http::StatusCode::INTERNAL_SERVER_ERROR)
            });
            curr_period += 1;
        }
    }
    let create_periods = CreatePeriodData {
        data: period_data
    };
    Ok(axum::Json(create_periods))
}
