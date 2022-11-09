## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [JSFile]

## General info

BackEnd: Test Profile Login & Registration.

## Technologies

Project is created with:

- @koa/cors: 4.0.0
- koa: 2.13.4
- koa-body: 6.0.1
- koa-morgan: 1.0.1
- koa-router: 12.0.0
- koa-static: 5.0.0

- apollo-server: 3.10.3
- graphql: 16.6.0
- dataloader: 2.0.0

- mssql: 9.0.1
- objection: 3.0.1

- dotenv: 16.0.3
- bcrypt: 5.1.0
- through2: 4.0.2
- uuid: 9.0.0
- date-fns: 2.29.3
- es6-error: 4.1.1
- jsonwebtoken: 8.5.1
- lodash: 4.17.21
- winston: 3.8.2
- yup: 0.32.11

- html-pdf-node: 1.0.8

## Setup

To run this project, install it locally using npm:

```
$ npm install
$ Load script.ipynb in SqlServer
$ npm run start:dev
```

## JSFile

apolloServer.js
app.js
config.js
errors.js
index.js
api\index.js
api\pdf\index.js
api\pdf\postPDF.js
api\upload\index.js
api\upload\postUpload.js
graphql\schema.js
graphql\enums\OrderDirection.js
graphql\mutations\authenticate.js
graphql\mutations\createEvent.js
graphql\mutations\createUser.js
graphql\mutations\deleteEvent.js
graphql\mutations\deleteUser.js
graphql\mutations\editEvent.js
graphql\mutations\editUser.js
graphql\queries\event.js
graphql\queries\events.js
graphql\queries\me.js
graphql\queries\users.js
graphql\scalars\DateTime.js
graphql\types\Event.js
graphql\types\EventConnection.js
graphql\types\PageInfo.js
graphql\types\User.js
graphql\types\UserConnection.js
models\BaseModel.js
models\Detail.js
models\Event.js
models\User.js
utils\authService.js
utils\createDataLoaders.js
utils\graphGenerate.js
utils\knex.js
utils\logger.js
utils\signJwt.js
utils\verifyJwt.js
utils\pagination\cursorPaginate.js
utils\pagination\cursorWhere.js
utils\pagination\normalizeOrderBy.js
utils\pagination\parseCursor.js
utils\pagination\reverseOrderBy.js
utils\pagination\serializeCursor.js
