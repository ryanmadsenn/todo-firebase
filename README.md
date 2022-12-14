# todo-firebase

# Overview

This software is a todo webapp that uses the firestore cloud database to store todo item content and status. 

I wrote this software because I wanted to learn more about cloud databases and a todo app is a perfect application to use with a cloud database.

[Software Demo Video](https://youtu.be/VdOLsAL0kdk)

# Cloud Database

Firebase Firestore

Firebase's Firestore database is organized in a series of collections and documents. Collections store multiple documents, and documents store the information in key value pairs. For my todo app, I made a collection called "todos" that contains each individual todo as a document. Each todo document has the todo content and complete status.

# Development Environment

* Visual Studio Code
* Firebase Firestore Cloud Database
* JavaScript
* HTMl/CSS

# Useful Websites
* [Firebase Documentation](https://firebase.google.com/docs?gclid=Cj0KCQiAvqGcBhCJARIsAFQ5ke4b45LReoVfyZ1kTdcXyf9y5f2rUMByMSnp4mMEJUKci4CUZYL_hzMaAmCsEALw_wcB&gclsrc=aw.ds)

# Future Work
* Add the ability to create an account so that multiple users can store their todos in the app
* Add a login feature so that a user's todos are password-protected
