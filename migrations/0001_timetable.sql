-- should be using either 1. list of references or 2. json to handle this repitition. the problem is:
--      1. currently postgres doesnt support lists of of specifically foreign keys
--      2. json information is an independant data type and values cannot be considered as foreign keys. this would usually be fine but because it specifies that we need a certain amount of relationships ill just have to repeat this trash. there must be some way that im not familiar with to get around this but ive been looking for a couple days and cant find anything

CREATE TABLE IF NOT EXISTS period (
    id UUID PRIMARY KEY NOT NULL,
    subject VARCHAR,
    room VARCHAR(4),
    teacher VARCHAR,
    UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS day (
    id UUID PRIMARY KEY NOT NULL,
    period_1 UUID REFERENCES period(id) NOT NULL, -- "period 0"
    period_2 UUID REFERENCES period(id) NOT NULL, -- "before school"
    period_3 UUID REFERENCES period(id) NOT NULL, -- "home room"
    period_4 UUID REFERENCES period(id) NOT NULL, -- "period 1"
    period_5 UUID REFERENCES period(id) NOT NULL,
    period_6 UUID REFERENCES period(id) NOT NULL,
    period_7 UUID REFERENCES period(id) NOT NULL,
    period_8 UUID REFERENCES period(id) NOT NULL,
    period_9 UUID REFERENCES period(id) NOT NULL,
    period_10 UUID REFERENCES period(id),-- "period 7"
    UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS week (
    id UUID PRIMARY KEY NOT NULL,
    day_1 UUID REFERENCES day(id) NOT NULL, -- monday
    day_2 UUID REFERENCES day(id) NOT NULL,
    day_3 UUID REFERENCES day(id) NOT NULL,
    day_4 UUID REFERENCES day(id) NOT NULL,
    day_5 UUID REFERENCES day(id) NOT NULL, -- friday
    UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS timetable (
    id UUID PRIMARY KEY NOT NULL,
    week_1 UUID REFERENCES week(id) NOT NULL, -- "week A"
    week_2 UUID REFERENCES week(id) NOT NULL, -- "week B"
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
    timetable_id UUID REFERENCES timetable(id) NOT NULL,
    UNIQUE (id)
);
