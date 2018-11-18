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
The application source files can be found on github here (add hyperlink later).  
add:
- how to set up database (if needed)
- steps to run the app

## Logging in
Upon running the app and navigating to the home page, a list of users will be visible. To log in as a specific user, select the user from the list and click the "log in" button.

## Creating a User
In order to create a user, you must first be logged in as "admin". (add more here) 
 
## Deleting a User
In order to delete a user, you must first be logged in as "admin". (Add more here)

## Creating a Project
To create a project, first log in by selecting the user from the home page. Upon logging in, you will be shown a list of existing projects as well as an option to create a project. Select the option to create a new project. The system will display a blank form to enter project details. Enter the project information including the name, (add other parameters here). Once the project information has been filled in, select the option to create the project, and you will be redirected back to the project overview page and the new project will be visible. 

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
