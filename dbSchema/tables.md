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
        Account_type account_type
);


CREATE TABLE IF NOT EXISTS 
    feeds (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        Title VARCHAR(128) NOT NULL,
        Content VARCHAR(255) [] NOT NULL,
        UserID int NOT NULL,
        Type ContentType, 
        CreatedOn TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS 
    comments (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        Comment TEXT NOT NULL,
        UserID int NOT NULL,
        ContentID int NOT NULL,
        CreatedOn TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (ContentID) REFERENCES feeds(id) ON DELETE CASCADE
);


