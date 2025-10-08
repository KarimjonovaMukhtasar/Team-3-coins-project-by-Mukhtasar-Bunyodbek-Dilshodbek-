-- Active: 1759236905510@@127.0.0.1@5432@coins

create database coins;

create table users(id SERIAL primary key,
        name varchar not null,
        email  varchar unique,
        password varchar,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now());


create table collections(id serial primary key,
        user_id int REFERENCES users(id) on delete cascade,
        title varchar,
        description text,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        image bytea);


create table coins(id serial Primary key,
        name varchar not null,
        country varchar,
        year SMALLINT,
        material varchar,
        value varchar,
        created_at TIMESTAMP default now(),
        updated_at TIMESTAMP default now());

create table collection_coins(id serial PRIMARY KEY,
        collections_id int REFERENCES collections(id) on delete cascade,
        coin_id int REFERENCES coins(id) on delete cascade,
        condition varchar,
        note varchar,
        added_at TIMESTAMP default now()
        )

create type trade_status as enum ('Pending','Accepted', 'Rejected');
create table trades(id SERIAL PRIMARY KEY,
        from_user_id int REFERENCES users(id),
        to_user_id int REFERENCES users(id),
        coin_id int REFERENCES coins(id),
        status trade_status default 'Pending',
        created_at TIMESTAMP default now());

create table comments(id serial primary key,
        collections_id int references collections(id) on delete cascade,
        user_id int references users(id),
        text text,
        created_at TIMESTAMP DEFAULT now());


create table tags(id serial primary key,
        name varchar unique)

create table collection_tags(id serial primary key,
        collection_id int REFERENCES collections(id) on delete cascade,
        tag_id int REFERENCES tags(id) on delete cascade);

select * from users;

