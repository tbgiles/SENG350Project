# Functional Software Requirements Application
## Project Submission for SENG 350 - Fall 2018

*Matthew Fortier, Tristan Giles, Amritijot Madahar, Geena Smith*

The  web application described in this manual was designed and built as a project for SENG 350 in the fall of 2018. The objective of this application was to create a project management tool to enable architects to define and manage functional requirements in the form of use cases.

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
The application source files for this project can be found [here](https://github.com/tbgiles/SENG350Project)  

To be able to run the application, the following software dependencies must be installed
- TypeScript (v2.9.2)
- Node (v8.10.0)
- NPM  (v3.5.2)
- Express (v4.16.4)
- MongoDB  (v3.1.7)
- Python (v2.7.15rc1)

After the installation of these dependencies, the application itself can be installed. First, we must start the database. Open a terminal in the Mongo installation directory and type
```
sudo ./mongod
```
This will start the database and enable us to send and retrieve data.

Next, we build the application. Open a terminal in the application installation directory and type:
```
npm install --save
```
This will install all node dependencies and will also run a full build of the Angular modules.

Next, we fill the database with startup data. In the same terminal as before, enter the command
```
python scripts/dbinit.py
```
followed by
```
python scripts/dbpopulate.py
```
which will initialize our database to work with our application. (NOTE: We are using Python 2 for these scripts, if any errors arise from uninstalled python dependencies, running a pip install should resolve any issues)

Once the database is set up, and we have built the application, we can start the application:  
- Start the database by typing
```
sudo ./mongod
```
in the Mongo installation directory
- Launch the application by typing
```
node server
```
in the application installation directory.

The application will now be running on [localhost:3000](http://localhost:3000/)  

## Logging in
After starting the application and navigating to the above link, the user will be prompted to login as a user. To log in as a user, select the user from the list and click the "log in" button, as shown in the below image.  

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

## Editing a Project (refine when implemented)
To edit a project, first log in as a user who is either the owner or has write permissions for the project. Navigate to the projects page with an overview of all projects associated with the user. Select the desired project and the "edit project" button. A modal will open on the current page with the project information. Update the information and click confirm.  

## Deleting a Project
To delete a project, first log in as the user who owns the project that is to be deleted and navigate to the projects page with the list of all projects associated with the user. Select the desired project and the option to view the project. From the list of use cases associated with the project, select the "delete project" button and confirm the deletion.   

## Changing Project Permissions (refine when implemented)
To change the permissions on a project, first log in as the user who owns the project. Navigate to the projects page with the list of all projects associated with the user, select the desired project, and the "edit project" button. A modal will open on the current page with the current project permissions. Update the permissions and click confirm.   

## Changing Project Ownership
To change a project's ownership, first log in as the user who owns the project and navigate to the projects page with the list of all projects associated with the user. Select the desired project and the option to view the project. From the list of use cases associated with the project, select the "transfer ownership" button and a modal will be displayed on the current page to select the new owner. Select the new owner from the list of users who currently have read or write permissions, and click confirm.   

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

![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/allusecases_overview.PNG)  

The page will update to show only matching use cases that the user has ownership, read, or write permissions on as the user types. Note that this search bar is case sensitive (Changing?).  

![](https://github.com/tbgiles/SENG350Project/blob/master/usermanual_images/usecases_search.PNG)

## Known Problems and Limitations
(TO DO)
