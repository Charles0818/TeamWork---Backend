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
        Category TEXT [],
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


CREATE TABLE IF NOT EXISTS
    feedFlag (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        ContentID INT NOT NULL,
        UserID BIGSERIAL NOT NULL,
        FOREIGN KEY (ContentID) REFERENCES feeds(id) ON DELETE CASCADE,
        FOREIGN KEY (UserID) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS
    commentFlag (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        CommentID INT NOT NULL,
        UserID BIGSERIAL NOT NULL,
        FOREIGN KEY (CommentID) REFERENCES comments(id) ON DELETE CASCADE,
        FOREIGN KEY (UserID) REFERENCES users(id) ON DELETE CASCADE
    )
    

    ADDING A USER 
    The query should be written in a way that it should first
    check whether the commentID/contentID exists in the table,
    if it exists, it should update the users attribute by adding
    the incoming userId to the existing list of users who flagged that same post.

    If the commentID/contentID doesn't exist, a new row should be created.

    NOTE: The commentID/contentID may act as primary key.