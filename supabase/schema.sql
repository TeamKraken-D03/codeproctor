create table profiles (
    id uuid primary key,
    role varchar(20) not null default 'student',
    created_at timestamp with time zone default timezone('utc', now()),

    constraint fk_profiles_users
        foreign key (id) references auth.users(id) on delete cascade
);
