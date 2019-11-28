[![Build Status](https://travis-ci.org/Charles0818/TeamWork---Backend.svg?branch=develop)](https://travis-ci.org/Charles0818/TeamWork---Backend)
[![Coverage Status](https://coveralls.io/repos/github/Charles0818/TeamWork---Backend/badge.svg?branch=develop)](https://coveralls.io/github/Charles0818/TeamWork---Backend?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/0f9fd6a03732861f2cae/maintainability)](https://codeclimate.com/github/Charles0818/TeamWork---Backend/maintainability)
# TeamWork---Backend
TeamWork is an internal social network for employees of an organization / company. It serves as a network communicating tool majorly for team collaboration.

The end product of teamwork---backend project has been deployed on heroku having its url as https://teamworkbycharles.herokuapp.com/

The above URL holds the API/backend of teamwork project.
The default URL for testing endpoints is given as https://teamworkbycharles.herokuapp.com/api/v1 followed by the endpoint

Here are the following queries and their respective endpoints you can perform on teamwork API

1. Admin can create an employee user account. (/auth/create-user)
2. Admin/Employees can sign in. (/auth/signin)
3. Employees can post gifs. (/api/v1/gifs)
4. Employees can write and post articles. (/articles)
5. Employees can edit their articles. (/articles/:articleId)
6. Employees can delete their articles. (/articles/:articleId)
7. Employees can delete their gifs post. (/gifs/:gifId)
8. Employees can comment on other colleagues' article post. (/articles/:articleId/comment)
9. Employees can comment on other colleagues' gif post. (/gifs/:gifId/comment)
10. Employees can view all articles and gifs, showing the most recently posted articles or gifs
first. (/feed)
11. Employees can view a specific article. (/articles/:articleId)
12. Employees can view a specific gif post. (/gifs/:gifId)
13. Employees can flag a comment, article and/or gif as inappropriate.
for comment => (/gifs/:gifId/comment/:commentId/flag) OR (/articles/:articleId/comment/:commentId/flag),
for article/gif (/feed/:contentId/flag) 
● Admin can delete a comment, article and/or gif flagged as inappropriate. (Coming soon)
