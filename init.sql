CREATE TYPE ContentType AS ENUM('gif', 'article');

CREATE TYPE account_type AS ENUM('admin', 'regular');

CREATE TABLE IF NOT EXISTS 
    users (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        gender VARCHAR(128) NOT NULL,
        jobRole VARCHAR(128) NOT NULL,
        department VARCHAR(128) NOT NULL,
        address VARCHAR(128) NOT NULL,
        PhotoDetails VARCHAR(255) [],
        Account_type account_type
);


CREATE TABLE IF NOT EXISTS 
    feeds (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        Title VARCHAR(128) NOT NULL,
        Content TEXT [] NOT NULL,
        UserID int NOT NULL,
        Type ContentType,
        IsFlagged BOOL,
        CreatedOn TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS 
    comments (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        Comment TEXT NOT NULL,
        UserID int NOT NULL,
        ContentID int NOT NULL,
        IsFlagged BOOL,
        CreatedOn TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (ContentID) REFERENCES feeds(id) ON DELETE CASCADE
);


