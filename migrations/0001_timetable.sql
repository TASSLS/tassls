CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY,
    password varchar NOT NULL,
    name varchar NOT NULL,
    photo varchar NOT NULL,
    dob TIMESTAMPTZ NOT NULL,
    created TIMESTAMPTZ NOT NULL,
    updated TIMESTAMPTZ NOT NULL,
    UNIQUE (id)
);

CREATE unique index student_uuid_idx on students (id);
