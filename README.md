# RecursiveNotebook2.WebClient

Based on **Angular 2.4.0**. Written in Visual Studio Code.

# Features

- [x] Login/Register 
- [x] Add/edit/remove notes

# Used patterns and solutions

- CQRS - for comunication with server
- JWT - for user authentication
- GUID - for user and notes indexing
- Bootstrap3 - for styling

# How to run

- do **npm install** after download
- make sure server listen on *http://localhost:1234/api/cqrsbus* (or change endpoint in *cqrs-bus.service.ts*)
- in console: **ng serve** and then open browser at *http://localhost:4200*

# Backend

This project needs **RecursiveNotebook2.Server** to work properly.

