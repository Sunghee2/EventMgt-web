# eventMgt_web

https://hidden-hamlet-34878.herokuapp.com/ 

## Table of Contents

1. [개발 환경](#개발-환경)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Running this project](#running-this-project)
3. [Screenshots](#screenshots)
4. [Functions](#functions)

## 개발 환경

- pug + scss + bootstrap4 + jQuery + ajax
- node.js + express.js + mongoDB(mongoose)(mLab)
- facebook login, kakao login, daum map, mailgun, tinymce

## Getting Started

#### Prerequisites

* Facebook Api Key

  Add clientId, clientSecret in `lib/passport-config.js` 

* Kakao Api Key

  Add clientId, clientSecret in `lib/passport-config.js` 

* mLab connect string

  Add connect string in `app.js` 

  **Note** - not use mLab : Add `mongodb://localhost/<db-name>` in `app.js`

* Mailgun Api Key

  Add api_key, domain in `routes/index.js`

* Tinymce

  Add api_key in `views/events/edit.pug` & `views/events/new.pug`

* daum map

  Add api_key in `views/events/edit.pug` & `views/events/_form.pug` & `views/events/new.pug` & `views/events/map.pug`

#### Running this project

```
$ npm install
$ npm start
```



## Screenshots

https://hidden-hamlet-34878.herokuapp.com/ 

![example](./screenshots/sample.gif)



## Functions

- Signup & Signin & find Password(mail) & Logout(local, facebook, kakao)
- Edit user info & change password & withdrawal
- Create, edit, delete event
- event list(card-type, map-type)
- Search for events by keyword, region and discipline 
- register event / bookmark event
- Write Q&A, Review 

