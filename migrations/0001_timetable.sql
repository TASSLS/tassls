CREATE TABLE IF NOT EXISTS period (
    id UUID PRIMARY KEY NOT NULL,
    subject VARCHAR,
    room VARCHAR(4),
    teacher VARCHAR,
    UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS day (
    id UUID PRIMARY KEY NOT NULL,
    period_1 UUID REFERENCES period(id), -- "period 0"
    period_2 UUID REFERENCES period(id), -- "before school"
    period_3 UUID REFERENCES period(id), -- "home room"
    period_4 UUID REFERENCES period(id), -- "period 1"
    period_5 UUID REFERENCES period(id),
    period_6 UUID REFERENCES period(id),
    period_7 UUID REFERENCES period(id),
    period_8 UUID REFERENCES period(id),
    period_9 UUID REFERENCES period(id),
    period_10 UUID REFERENCES period(id),-- "period 7"
    UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS week (
    id UUID PRIMARY KEY NOT NULL,
    day_1 UUID REFERENCES day(id), -- monday
    day_2 UUID REFERENCES day(id),
    day_3 UUID REFERENCES day(id),
    day_4 UUID REFERENCES day(id),
    day_5 UUID REFERENCES day(id), -- friday
    UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS timetable (
    id UUID PRIMARY KEY NOT NULL,
    week_1 UUID REFERENCES day(id), -- "week A"
    week_2 UUID REFERENCES day(id), -- "week B"
    UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    photo VARCHAR NOT NULL,
    dob TIMESTAMPTZ NOT NULL,
    created TIMESTAMPTZ NOT NULL,
    updated TIMESTAMPTZ NOT NULL,
    timetable_id UUID REFERENCES timetable(id),
    UNIQUE (id)
);
