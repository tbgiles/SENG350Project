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
Upon running the app and navigating to the home page, a list of users will be visible. To log in as a specific user, select the user from the list and click the "log in" button.  
  
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/login_selected.PNG)
  
This will redirect to an overview page of all the use cases the user has permissions on.  
  
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/allusecases_overview.PNG)  

## Logging Out  
To log out from an account, simply select the "log out" button in the upper right hand corner.  
  
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/allusecases_overview.PNG)

## Creating a User
In order to create a user, you must first be logged in as "Admin". After being redirected from the log-in page, select the "Account Management" tab from the upper right corner, and a page of all the current users will be displayed, as well as an option to create a user. Select the "create a new user" option and ... (finish when it is created).
 
## Deleting a User
In order to delete a user, you must first be logged in as "Admin", and on the "Account Management" page of the application. Select the user that should be deleted from the list of all users. ... (finish when it is created)

## Creating a Project
To create a project, first log in as the user who the project will be initially owned by. Once logged in, select the "Projects" tab in the upper right corner, which will redirect to a page showing all projects owned by the logged-in user, as well as an option to create a new project.  
  
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/projects_overview.PNG)  

Select the option to "Create a new project" which will display a modal with a form to enter the information for a new project. Fill in the title of the project and select the project permissions for other users. Once this information is entered, select the "submit" button at the bottom of the modal.  
  
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/create_project_modal.PNG) 
  
The newly created project will now be visible in the projects overview page.  
  
(Need to add image)


## Viewing a Project
To view a project, first log in as the desired user. Navigate to the projects overview page using the "projects" tab in the upper right. The projects overview page will be a list of projects that the user either owns or has read or write permissions on.  
  
To view a specific project, select it from the list and the page will redirect to an overview of the use cases associated with the project.  
(add images when done)

## Editing a Project
(TO DO)  

## Deleting a Project
(TO DO)  

## Changing Project Permissions
(TO DO)  

## Changing Project Ownership
(TO DO)  

## Creating a Use Case
To create a use case first log in and navigate to the projects overview page. From the list of project, either select or create the project the new use case will be associated with, and select the option to view the project. Note that this option will only be possible if the logged-in user owns or has write permissions on the project.  
  
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/usecases_overview.PNG)  
  
On the use case overview page for the selected project, select "Create a new use case". This will open a modal with a form to enter information for the new use case. Once the information is filled in, select "submit" at the bottom of the modal. 
   
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/usecase_create.PNG)  
    
The newly created use case will now be visible in the use case overview page for both the individual project and for all projects (through selecting the "use cases" tab).  
  
(add image)

## Editing a Use Case
To edit a use case, first log in as the desired user and locate the desired use case either from the page of all use cases, or through selecting a project from the projects page. Select the use case that is to be edited and select "view usecase". A modal will open displaying a form that is prepopulated with the existing information.  

![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/usecase_view.PNG)  
  
Edit the information as desired and select the "submit" button. Note that the "submit" button will only be visible and the use case will only be updated if the user has write permissions for the project.  

## Deleting a Use Case
To delete a use case, first log in as the owner of the use case to be deleted and locate the desired use case either from the page of all use cases, or through selecting a project from the projects page. Select the use case that is to be deleted and select "delete usecase".  
  
![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/usecase_delete.PNG)

## Searching for a Use Case
To search for an existing use case, first log in as the desired user. The use case overview page will display a search bar that can be used to search for a use case.  
  
![](usermanual_images/allusecases_overview.png)  
  
The page will update to show only matching use cases that the user has ownership, read, or write permissions on as the user types. Note that this search bar is case sensitive (Changing?).  
  
![](usermanual_images/usecases_search.png)

## Known Problems and Limitations
(TO DO)
