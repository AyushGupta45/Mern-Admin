# Admin Dashboard Project

Welcome to the Admin Dashboard project! This repository contains the code for a MongoDB, Express, React, and Node.js (MERN) application.

## Prerequisites

Before running the project locally, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

To get started with the project, follow these steps:

1. Clone the Repository
   ```bash
   git clone https://github.com/AyushGupta45/Mern-Admin.git
   cd mern-admin-dashboard
   ```

2. Install Dependencies
   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```


3. Set Up Environment Variables
Part 1: Create Environment Variables in Root
Create a .env file in the root of the project and add the following keys:

In the project root directory, create a file named .env.
Add the MongoDB URL, JWT Secret, Email, Password, and Verification Link:

```bash
MONGO_URL="MONGO URL"
JWT_SECRET="knibnaeiutniubntiuaninrijk"
EMAIL="_YOUR EMAIL"
PASSWORD="APP PASSWORD"
VERIFICATION_LINK="(URL)/verify-email/"
```

Part 2: Create Environment Variable for Firebase API Key in Client
Create an .env file in the client directory and add the Firebase API Key:
Navigate to the client directory of the project.

```bash
cd client
Create a file named .env.
```

Add the Firebase API Key to the .env file in the client directory:

```BASH
VITE_FIREBASE_API_KEY="FIREBASE API KEY"
```

## Steps to Obtain App Password for Sending Emails:

1. **Sign In to Your Google Account:**
   - Go to Google Account and sign in with your credentials.

2. **Go to Security Settings:**
   - Under the Security Settings find and click on "App passwords". You may need to verify your identity by entering your password again.

3. **Select App and Device:**
   - In the "App passwords" page, you'll be prompted to select the app and device for which you want to generate an app password.
   - Select "Mail" as the app.
   - Select the device or app you want to use to send emails (e.g., "Other (Custom name)").

4. **Generate App Password:**
   - Click on "Generate" to create a new app password.
   - This is the password you will use in your application to send verification emails.

## Obtain Firebase API Key

1. **Create a Firebase Project:**
   - Go to the Firebase Console and log in with your Google account.
   - Click on "Add project" and follow the prompts to create a new Firebase project. Give your project a name and click "Create Project".

2. **Obtain Firebase API Key:**
   - Once your project is created, click on the project name to enter the project dashboard.
   - In the project dashboard, click on the gear icon (settings) next to "Project Overview" in the left sidebar.
   - Select "Project settings".
   - In the "General" tab, scroll down to the section titled "Your apps" and click on the web app icon (</>) to add a new web app to your project.
   - Register the app by giving it a nickname (can be anything) and click "Register app".
   - After registering the app, you will see a code snippet. The Firebase API Key will be included in this code snippet. Copy the API Key.

3. **Set Up Firebase Authentication:**
   - In the Firebase Console, navigate to the "Authentication" section from the left sidebar.
   - Click on "Set up sign-in method" and enable Google as a sign-in provider.
   - Save the changes.

4. **Activate Firebase Storage:**
   - In the Firebase Console, navigate to the "Storage" section from the left sidebar.
   - Click on "Get Started" to set up Firebase Storage for your project.
   - Follow the prompts to enable Firebase Storage.

5. **Add Firebase Storage Rules:**
   - In the Firebase Console, navigate to the "Storage" section.
   - Click on the "Rules" tab.
   - Replace the default rules with the following rules:

     ```firebase
     rules_version = '2';

     service firebase.storage {
       match /b/{bucket}/o {
         match /{allPaths=**} {
           allow read;
           allow write: if request.resource.size < 2 * 1024 * 1024 &&
             (request.resource.contentType.matches('image/.*') ||
             request.resource.contentType.matches('application/pdf') ||
             request.resource.contentType.matches('application/msword') ||
             request.resource.contentType.matches('application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
         }
       }
     }
     ```

   These rules allow read access to everyone and write access if the uploaded file meets the specified conditions (file size and content type).

## Running the Project in Development Mode

To run the project in development mode, you'll need two terminal windows.

1. In the first window, start the server:
   ```bash
   cd server
   npm run dev
   ```

2. In the second window, start the React app:
   ```bash
   cd client
   npm run dev
   ```

This will run the server on [http://localhost:3000](http://localhost:3000) and the React app on [http://localhost:5173](http://localhost:5173).

## Accessing the Application

Once the server and client are running, you can access the application in your web browser: [http://localhost:5173](http://localhost:5173)

## Manual Admin Privileges Required

To grant administrative privileges to a user, follow these steps:

1. Access the database.
2. Locate the "user" collection.
3. Find the user profile that needs admin access.
4. Edit the user document.
5. Set the "isAdmin" field to "true". By default, this field is set to "false".
6. Once this change is made, the user will have administrative rights within the system.

## Questions or Issues

If you have any questions or encounter any issues while setting up or running the project, feel free to create an issue on this repository. We'll be happy to help!
