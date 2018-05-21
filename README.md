# LinkedList API

## Overview

A LinkedIn/AngelList clone coded by [Paula Goyanes](https://github.com/goyanespaula) & [Alex Bush](https://github.com/alexabush)

## Live URL

This API is currently running here: [https://linkedlist-paula.herokuapp.com/](https://linkedlist-paula.herokuapp.com/)

## Documentation

Full interactive API documentation available here: [https://linkedlist.docs.apiary.io/]()

##

## Development

    1. Install Node
    2. Install mongoDb
    3. (Testing) Install Jest
    4. Install nodemon globally

## Getting Started

fork the repository [https://github.com/alexabush/LinkedList]()

    $ git clone https://github.com/alexabush/LinkedList
    $ cd linkedList
    $ npm install

## Starting Server

    1. In a terminal:
    $ mongodb
    2. In a separate tab/terminal:
    $ nodemon server.js

Note: You should be running 'mongodb' in one terminal and at the same time running 'nodemon server.js' in the other

## API STRUCTURE

API consists of three resources:

1.  Users 2. Companies 3. Jobs

## Routes

### Company Routes

* GET all companies `/companies` - Login Required (As User or Company)
* POST add new company `/companies`
* GET a company `/companies/{handle}` - User Login Required
* PATCH update a company `/companies/{handle}` - Company Login Required, Ensure Correct Company
* Delete remove a company `/companies{handle}` - Company Login Required, Ensure Correct Company

### User Routes

* GET all users `/users` - User Login Required
* POST add new user `/users`
* GET a user `/users/{username}` - User Login Required
* PATCH update a user `/users/{username}` - User Login Required, Ensure Correct User
* Delete remove a user `/users{username}` - User Login Required, Ensure Correct User

### Job Routes

* GET all jobs `/jobs` - User Login Required
* POST add new job `/jobs` - Company Login Required
* GET a job `/jobs/{jobId}` - User Login Required, Ensure Correct User
* PATCH update a job `/jobs/{jobId}` - Company Login Required, Ensure Correct Company
* Delete remove a job `/jobs{jobId}` - Company Login Required, Ensure Correct Company
