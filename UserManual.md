to do:
- add screenshots
- fill in set up section

# Functional Software Requirements Application  

*Matthew Fortier, Tristan Giles, Amritijot Madahar, Geena Smith*

The web application described in this manual was build as a project for SENG 350 in the fall of 2018. The objective of this application was to define and manage functional requirements in the form of use cases.  
  
  The requirements of the application included the following:
- The app must be web-based and built using TypeScript, Node, Express, MongoDB, and Angular.
- The app must support different user IDs and each user should be able to create, update and delete multiple projects.
- There must be an "admin" user, which cannot be deleted, that has the ability to create or delete other regular user IDs.
- Users can invite other users to view or edit projects, however only the project owner can delete a project.
- Users can surrender project ownership to another user.
- Projects consist of a title, a description, and a set of use cases.
- Each use case is defined in a structure according to the "Cockburn Template". 
- The app must provide an overview page that lists all use cases accessible by a user and allows the user to search for use cases.  
  
## Set Up
The application source files can be found in a github repository here (add hyperlink later).  
  
To be able to run the application, the following dependencies must be installed (*check these to make sure we dont need to add/remove any*):  
- TypeScript  
- Node  
- Express  
- MongoDB  
- Python3  
  
Before running the application, the database must be initialized by completing the following steps:  
- from a terminal, run the command "mongod" to run the database
- from a separate terminal, run the file "scripts/dbinit.py". This file will create the database structure and add the "Admin" user.  
  
Once the database is set up, we can run the application:  
- Start the database using the "mongod" command  
- Build the application using "ng build" in a separate terminal.  
- Launch the application using "node server.js".  
  
The application will now be running on "localhost:3000".  


## Logging in
Upon running the app and navigating to the home page, a list of users will be visible. To log in as a specific user, select the user from the list and click the "log in" button. This will redirect to an overview page of all the use cases the user has permissions on.  
  
## Logging Out  
To log out from an account, simply select the "log out" button in the upper right hand corner.  

## Creating a User
In order to create a user, you must first be logged in as "admin". (add more here) 
 
## Deleting a User
In order to delete a user, you must first be logged in as "admin". (Add more here)

## Creating a Project
To create a project, first log in by selecting the user from the home page. Once on the use case overview page, select the "Projects" tab in the top right of the page. This will redirect to a page of all the existing projects the user has permissions for. This will also display an option to create a new project. Selecting this option will open a modal with a form to create a new project. Fill in the project title and select permissions for the desired users. To create the project,   


## Viewing a Project
To view a project, first log in by selecting the user from the home page. Upon logging in, you will be shown a list of existing projects that the user either owns or has permission to view or edit. To view a specific project, select it from the view of projects, and you will be shown the specific project and it's use cases.

## Editing a Project

## Deleting a Project

## Changing Project Permissions

## Changing Project Ownership

## Creating a Use Case

## Editing a Use Case

## Deleting a Use Case

## Searching for a Use Case

## Known Problems and Limitations
