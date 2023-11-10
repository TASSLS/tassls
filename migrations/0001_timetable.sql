CREATE TABLE IF NOT EXISTS students (
    id UUID not null primary key,
    name varchar not null,
    photo varchar,
    dob date
);

CREATE unique index student_uuid_idx on students (id);
