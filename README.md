# Table of Contents

- [Table of Contents](#table-of-contents)
- [Report: ProxyBrowser Project Documentation](#report-proxybrowser-project-documentation)
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
  - [Project Overview](#project-overview)
  - [Development Guidelines](#development-guidelines)
  - [Additional Resources](#additional-resources)



# Report: ProxyBrowser Project Documentation

## Introduction

1. ### Project Overview
    ProxyBrowser represents a web browsing application developed to prioritize user security as its core principle. With an unwavering commitment to enhancing the online experience, ProxyBrowser offers a comprehensive suite of features that have been thoughtfully customized to cater to the discerning needs of individuals who value privacy and seek a high degree of control over their online activities. By seamlessly integrating state-of-the-art security measures and a rich feature set, ProxyBrowser ensures that users can navigate the web with confidence, safeguarding their digital presence while optimizing their browsing experience.

2. ### Purpose of Documentation
    The purpose of this documentation is to provide a clear understanding of the ProxyBrowser project, its functionality, development processes, and how to contribute to its growth. It serves as a reference for developers, contributors, and users.

3. ### Audience
    This documentation is intended for: 
- Developers and contributors interested in understanding and contributing to the ProxyBrowser project.
- Users seeking information on ProxyBrowser\'s features and functionality.
- Project managers and stakeholders looking for an overview of the project\'s structure and development guidelines.

## Getting Started
Currently, we have three repositories: one dedicated to Front-end development, another for Back-end, and a third one specifically for the browser.
- Front-End: \"**proxy-browser**\"
- Back-End: \"**proxy-browser-backend**\"
- Browser: \"**Fifo-Browser-Extended**\"

1. ### Fifo-Browser-Extended 
    1.1. **Setting Up the Development Environment**
    Before beginning, it\'s crucial to ensure that your current Node.js and npm versions are compatible with the project\'s requirements. Please follow these steps to prepare your environment:
    - **To Install Project dependencies, use the following command:**
        - This project exhibits better compatibility with Yarn compared to npm.
          
        -     yarn 
    - **To initialize the project in development mode for the first time, please follow these steps:**
      
        -     yarn rebuild
        -     yarn dev
    - **For subsequent runs in development mode, use the following command:**
      
        -     yarn dev
    - **For creating the browser build to place in Front-End:**
      
        -     yarn build 

2. ### Proxy-Browser-Backend
    2.1. **Setting Up the Development Environment**
    - Create a file named ".env" at the root level of the folder.
    - Define env variables into it.
    - **To Install Project dependencies, use the following command:**
  
        -     npm install 
    - **To initialize the project in development mode for the first time, please follow these steps:**
      
        -     npm run db:migrate
        -     npm run stripe:seeder
        -     npm run dev
    - **For subsequent runs in development mode, use the following command:**
      
        -     npm run dev
    - **If you need to make changes to the database through migrations, perform the following steps:**
      
        -     npm run generate-migration -- --name <migration-name>
        -     npm run db:migrate
    - **To revert changes made by the last migration, use the command:**
      
        -     npm run db:migrate:undo

    2.2. **Project Structure**
    The project adheres to a standard directory structure typical of a **Node.js/Express** backend project. It is organized as follows:
    - **config** - Configuration files that store settings and parameters for the database
    - **controllers** - Modules responsible for handling incoming HTTP requests, processing data, and sending appropriate responses.
    - **joiSchemas** - Schemas defined using the Joi library to validate and sanitize incoming data from requests.
    - **middlewares** - Functions that intercept and process requests before they reach the controller.
    - **models** - Representations of database tables.
    - **routes** - Definitions for the URL endpoints of API, mapping incoming requests to the appropriate controller methods.
    - **utils** - Utility functions and helper modules used throughout the application for common tasks.
    - **views** - templates for rendering dynamic HTML content in email.
    - **app.js** - The entry point of the Express application where you set up server configurations, middleware, and initialize routes.

    2.3. **Implementation Approach**
    - **Models:**
      - **Direct Mapping to Database Tables:** Each of these models corresponds directly to respective database tables, ensuring a structured and organized data storage approach.
      - **Consistent Querying Components:** These models are integral components employed consistently across the project, facilitating data querying operations.
      - **Utilization of Sequelize:** The implementation of these models is streamlined and made efficient through the use of Sequelize, a database ORM (Object-Relational Mapping) tool.
      - **Advantages of Sequelize:** Sequelize was chosen for its ease of query construction, simplifying the process of interacting with the database. Additionally, it offers inherent safeguards against SQL injection attacks, enhancing security.
      - **MySQL Database:** The project employs a MySQL database in conjunction with Sequelize, providing a robust and reliable backend data storage solution.
   
    - **Attribute Knowledge**
      - **Users**
      
        | Attribute Name | Possible Values | Description |
        | ------------ | ------------ | ------------ |
        | email | Any Valid Email  | An email associated with user |
        | account_type | 'Personal', 'Business' | Type or level of user account |
        | password | Any Combination of Character  | Secure access code for the account |
        | first_name | String | First name of the user  |
        | last_name | String | Last name of the user |
        | country | Any valid country name | User's country of residence |
        | city | Any valid city name of entered country | User's city of residence |
        | state | Any valid state name of entered country | User's state of residence |
        | zip_code | 5-digit numeric code | User's postal code |
        | address | String | User's street address |
        | stripe_customer_id | String | Stripe Customer ID to manage subscription |

        - **Relations**
          -  A **User** has many **OTP**
          -  A **User** has many **PaymentMethods**
          -  A **User** has many **Plans**
          -  A **User** has many **Locations**
          -  A **User** has many **Sessions**
          -  A **User** has many **LocationConfigurations**

       - **Locations**

         | Attribute Name | Possible Values | Description |
         | ------------ | ------------ | ------------ |
         | name | String  | A name set by user for location |
         | home_page | Any Website's URL  | A home_page that will be opened when that location is used |
         | location | Valid Proxy Location  | A proxy Location |

          - **Relations**
            -  A **Location** belongs to a **User**
            -  A **Location** has one **Session**
            -  A **Location** has one **LocationConfigurations**
              
       - **OTP**
         | Attribute Name | Possible Values | Description |
         | ------------ | ------------ | ------------ |
         | code | Any 4-character alphanumeric String  | A code to be entered by the user to reset password |
         | creation_timestamp | Timestamp | A timestamp when code was created |
         | expiry_timestamp | Timestamp  | A timestamp when the code will be expired |
         | is_used | true, false  | To check whether code is used or not |

         - **Relations**
            -  An **OTP** belongs to a **User**
          
       - **PaymentMethods**
         | Attribute Name | Possible Values | Description |
         | ------------ | ------------ | ------------ |
         | stripe_card_id | String | Stripe Customer ID to pay for subscription |
         | last_four | 4-characters long numeric string | to store the last 4 digits of the user's card |

         - **Relations**
            -  A **PaymentMethod** belongs to a **User**

       - **Plans**
         | Attribute Name | Possible Values | Description |
         | ------------ | ------------ | ------------ |
         | amount | Numeric String | The amount paid by the user for the plan |
         | buying_date | Date | Date at which amount was paid by the user  |
         | expiry_date | Date | Date at which plan will be expired |
         | subscription_id | String | Stripe Subscription ID of the user |
         | status | "active", "cancelled" | Whether plan is currently active or cancelled by the user |

          - **Relations**
            -  A **Plan** belongs to a **User**
           
       - **Sessions**
         | Attribute Name | Possible Values | Description |
         | ------------ | ------------ | ------------ |
         | created_timestamp | Timestamp | A timestamp when the session was created |
         | last_used_timestamp | Timestamp | A timestamp when the session was last used by the user |
         | is_active | true, false | To check if the session is active or not |
         | device_info | String | To store the info related to the device from which the user is accessing the app |

         - **Relations**
            -  A **Session** belongs to a **User**
            -  A **Session** belongs to a **Location**
       
       - **Configurations**  
         | Attribute Name | Possible Values | Description |
         | ------------ | ------------ | ------------ |
         | plugins | String of Array containing plugin objects | A plugins string of array of objects that have info of plugins that would mask the original one |
         | time_zome | String of timezone and timezone offset | A string containing timezone info that would mask the original one |
         | resolution | String | A string containing device resolution info that would mask the original one |
         | fonts | String | A string containing the names of all fonts that would mask the original one |
         | cookies_enabled | true, false | A check containing whether cookies would be enabled or not |
         | dnt_header | true, false | A check containing whether Do not track would be set or not |
         | language | String | A string containing the name of language that would mask the original one |
         | platform | String | A string containing the name of platform that would mask the original one |
      
         - **Relations**
             - A **Configuration** has one **LocationConfigurations**
      
       - **LocationConfigurations**
         | Attribute Name | Possible Values | Description |
         | ------------ | ------------ | ------------ |
         | user_id | Number | ID of User to which location belongs |
         | location_id | Number | ID of Location to which Configuration belongs |
         | configuration_id | Number | ID of Configuration |

         - **Relations**
             - A **LocationConfigurations** belongs to a **Users**
             - A **LocationConfigurations** belongs to a **Locations**
             - A **LocationConfigurations** belongs to a **Configurations**  
              
    - **Stripe:**
      - **Paid Services:** The services offered are available on a paid basis.
      - **Complimentary 7-Day Trial:** Upon user registration, individuals are granted a complimentary 7-day trial period, providing an initial experience without immediate charges.
      - **Subscription Billing:** After the trial period, users will be billed according to the subscription plan they select.
      - **User Registration and Stripe:** When users register, they are automatically enrolled as customers in Stripe.
      - **Payment Method Addition:** During the trial period, users have the secure option to add their preferred payment method.
        
    - **REST API:**
      - **Comprehensive Functionalities:** The API encompasses comprehensive functionalities for all models, addressing various aspects of user interaction and data management.
      - **User-Related Features:** For users, the API includes features like registration, login, profile updating, and password reset, enhancing user account management.
      - **Location Functions:** Location-related functions cover activities such as location creation, updating, retrieval of user-specific locations, accessing individual locations, and deletion, facilitating location-based services.
      - **OTP Handling:** OTP functionalities encompass OTP generation and validation, providing a secure means of user verification.
      - **Payment Method Management:** Users can add payment methods, create or revoke plans, and manage sessions through complete CRUD (Create, Read, Update, Delete) operations.
      - **Request Validations:** The API incorporates request validations using Joi schemas, ensuring data integrity and security.
      - **Stripe Integration:** The API seamlessly integrates with Stripe for payment processing, enhancing the payment experience for users and enabling secure transactions.
4. ### Proxy-Browser
    3.1. **Setting Up the Development Environment**
    -  **To verify your node and yarn version**
      
        -     node --version
    - **How To Install Specific Node Version**
        - **In Mac OS**
          - **Using brew**
            
            -     brew install node@18.16.1
            -     brew unlink node
            -     brew link node@18.16.1
            -     node -v
          - **Using nvm (Node Version Manager)**
            -   To install nvm in Mac OS follow this [link](https://tecadmin.net/install-nvm-macos-with-homebrew/)
              
            -     nvm install 18.16.1
            -     nvm use 18.16.1
        - **In Windows**
          - **Using nvm (Node Version Manager)**
            -   To install nvm on a Windows system, you can use this [download link](https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe) for the nvm setup.
              
            -     nvm install 18.16.1
            -     nvm use 18.16.1
        - **In Linux/Ubuntu**
          - **Using nvm (Node Version Manager)**
            -   To install nvm in Mac OS follow this [link](https://tecadmin.net/how-to-install-nvm-on-ubuntu-22-04/)
              
            -     nvm install 18.16.1
            -     nvm use 18.16.1
    - Create **.env** file at root and add environment variables in it.
    - Create **env** folder in public folder and create/place locations env files there. Exact name of the file would be displayed to the user. **Example** London.env
    - Download [this folder](https://drive.google.com/drive/folders/1WZbUThMiuSLOYHkK-sFE-ARhsbOZzHtK?usp=sharing) and [this folder](https://drive.google.com/drive/folders/1DnLFpQkG7jzltd3rCT97-f8lnBUnzGAG?usp=sharing) place them inside extraResources folder on the same level as browser folder. **Do not change their name**.
    - Create Browser build in Fifo-Browser-Extended repo and paste that build inside **extraResources/browser** folder.
    - **To Install Project dependencies, use the following command:**
        - This project exhibits better compatibility with Yarn compared to npm.
          
        -     yarn 
    - **To run the project in development mode, execute the following command:**
   
        -     REACT_SERVER_URL=http://127.0.0.1:3000 yarn dev
    - **To package the project for Mac and Windows Operating System, execute the following commands:**
  
        -     yarn build
        -     yarn package 

    3.2. **Project Structure**
    The project follows a directory structure similar to that of a basic **React App**. It is organized as follows:
    - **public**
      - **electron.js** - Responsible for launching the project using Electron JS.
      - **openProject.js** - Responsible for launching the browser.
      - **preload.js** - Responsible for registering Inter-Process-Communication Channels.
      - **Index.html** - Serves as the primary entry point for the application.
    - **extraResources** - This directory houses all the additional files that are required by packaged app.
      - **browser** - create browser build and place it inside this folder.
    - **src**
        - **assets** - This directory houses various project assets, including images, SVGs, and more.
        - **component** - Within this directory, you\'ll find the React components utilised in constructing pages.
        - **pages** - This directory houses the pages, which serve as containers for the React components.

    3.3. **Implementation Approach**
     - **JSX:**
       - **Dynamic User Interface:** The goal was to achieve a dynamic and versatile user interface for the project.
       - **JSX and React:** JSX (JavaScript XML) was employed in conjunction with the React framework to accomplish this objective.
       - **Dynamic UI Creation:** This strategic choice enabled the creation of highly dynamic user interfaces with fluid and responsive displays.
       - **Modular Components:** The interfaces were further broken down into modular components, promoting code reusability.
       - **Encapsulated Functionality:** Functionality was encapsulated within these reusable components, optimizing code efficiency and maintainability.
       - **Streamlined Development:** Leveraging JSX and React not only improved the user experience but also streamlined the development process.
       - **Code Maintainability:** This approach enhanced code maintainability, making it easier to manage and update.
       - **Extensibility:** The project became more extensible, paving the way for future iterations and enhancements.

     - **MUI:**
       - **Workflow Acceleration:** Material UI components were integrated into the development process, expediting the workflow.
       - **Rich Array of Components:** This integration granted access to a diverse selection of meticulously crafted and pre-optimized components.
       - **Development Efficiency:** Material UI components significantly accelerated the development pace, reducing the time required to build various UI elements.
       - **Flexibility in Appearance:** These components provided flexibility, enabling the team to customize their appearance to seamlessly align with the project's specific theme and design requirements.
       - **Cohesive User Interface:** The integration of Material UI ensured a cohesive and polished user interface, contributing to a consistent visual identity throughout the application.
       - **Streamlined Development:** By harnessing the capabilities of Material UI, development efforts were streamlined, resulting in a more efficient and productive development process.

## Project Overview
1. ### Project Goals
    The goal of the ProxyBrowser project is to develop a feature-rich, user-friendly web browser application with enhanced privacy, security, and customization options. The project aims to provide users with a versatile and personalized browsing experience, while also prioritizing their online privacy and data security.
2. ### Key Features Along with User Interface
    Explore the core features of ProxyBrowser, including user authentication, proxy management, dedicated proxies, and more.
- **Separate Browser Instance**: Users can enjoy a dedicated and separate browser environment to maintain privacy and avoid interference with their main browsing session.
- **Downloading Files**: Users can initiate and manage downloads with a user-friendly interface, including specifying download locations and monitoring progress.

![Browser Download Settings Screen](/images/image-1.png)

- **Creating New Windows**: The browser supports multiple browser windows for multitasking and easy management of websites and tasks.

![Browser Screen with multiple windows](/images/image-2.png)

- **Managing Cookies**: Users have control over cookie settings, including enabling/disabling cookies, clearing cookies for specific sites, and managing preferences.
- **Local Storage**: HTML5 local storage support allows websites to store data on the user\'s device.
- **Search Engine Settings**: Users can select their preferred search engine from a list of options, with Google as the default engine.
  
![Browser Search Engine Setting Screen](/images/image-3.png)

- **Keyboard Shortcuts**: Enhanced keyboard shortcuts improve navigation efficiency, including tab management.
- **Proxy Support**: The browser offers support for a Las Vegas proxy, enabling IP address and location changes for enhanced privacy and access to geo-restricted content.
- **User Data and Sessions Isolation**: Each user\'s interactions are isolated, ensuring privacy and security. Separate directories and settings are created for each user.
- **Login/Sign up Functionality:**
    -  **Sign In**: Users can seamlessly access their accounts through a user-friendly interface by entering their credentials.
    -  **Sign Up**: New users can register securely, enabling enhanced features and personalized settings.

![Sign In Screen](/images/image-4.png)
![Sign Up Screen](/images/image-5.png)

- **Forgot Password Functionality:**
    -  **User Requests Password Reset**: Users can initiate a password reset by providing their email.
    -  **Send OTP (One-Time Password)**: A unique OTP is sent to the user\'s email for verification.
    -  **Enter OTP and Set New Password**: Users enter the OTP, set a new password, and regain access securely.

![Forgot Password Screen](/images/image-6.png)
![OTP Code Screen](/images/image-7.png)
![Set New Password Screen](/images/image-8.png)

- **Dashboard for Unique Proxies:**
    -  **Proxies Overview**: Users can monitor real-time proxy usage, performance, and status.
    -  **Filtering Capabilities**: Customizable data views with powerful filtering options based on location, speed, reliability, and more.
    -  **Proxy Management**: Easily add, edit, or remove unique proxies directly from the dashboard.

![Dashboard Screen](/images/image-9.png)

- **Creating A New Location:**
    -  **Name Your Location**: Users can name their new location for easy identification.
    -  **Set the Home Page URL**: Specify the home page URL for the new location.
    -  **Select the Country**: Choose the associated country from a dropdown menu.

![Create Location Screen](/images/image-10.png)

- **Edit/Delete A Location:** Users can access and manage created locations within the dashboard, edit/update location details, including name, URL, or country selection.

![Edit Location Screen](/images/image-11.png)

- **Dedicated Proxy:** Exclusive access to dedicated proxies ensures privacy, data security, and unrestricted browsing. Users can customize and configure dedicated proxies to meet their specific needs.

![Dashboard Screen](/images/image-12.png)

- **History Keeping:** Users can access, search, filter, sort, and organize their browsing history for a personalized experience.

![Browser History Screen](/images/image-13.png)

- **Tracking Protection:** The browser proactively identifies and blocks intrusive tracking technologies to safeguard online privacy. Users can tailor their privacy settings to match their preferences.

![Browser Privacy Settings Screen](/images/image-14.png)

- **Marking Page as Bookmark:** Users can mark web pages as bookmarks, making it easy to access and organize favorite and frequently visited websites.

![Browser Window with Bookmark Pop-up](/images/image-15.png)
![Browser Bookmarks Screen](/images/image-16.png)

- **Incognito Window:** Incognito Windows prioritizes user privacy by not recording browsing history, storing cookies, cached data, or autofilling data.

![Browser Incognito Screen](/images/image-18.png)

- **Browser Theme Settings:** Users can select themes (light, dark, custom) and customize the top bar variant and bookmarks settings.

![Browser Incognito Screen](/images/image-17.png)

- **Search Engine**:
    - **Search Engine Selection:**  In the Wexond Browser, users have the option to choose their preferred search engine from a list of available options.
    - **Default Engine Change:**  Previously, the default search engine in Wexond Browser was DuckDuckGo. However, in our extended version, we have made Google the new default search engine.
    - **Settings Data Modification:**  To implement this change, we modified the settings data within the browser.
    - **Data Storage:**  When a project is launched, it stores settings data, cookies, and local storage information in a dedicated directory specific to each user.
    - **Directory Reading:**  Subsequently, the project exclusively reads from this user-specific directory for all its data needs.
    - **Implementation Process:**  To enact this modification, it was necessary to remove the existing settings and then rebuild the project to reflect the updated default search engine setting.
- **Keyboard Shortcuts:**
    - **Enhanced Keyboard Shortcuts:**  The extended version of Wexond Browser introduces additional keyboard shortcuts to improve the browsing experience for users.
    - **Shortcut Functions:**  These shortcuts encompass various actions such as tab navigation, opening new tabs, closing tabs, and more, enhancing efficiency and navigation for power users.
    - **Efficient Tab Management:** Users can effectively manage multiple open tabs, utilizing keyboard shortcuts or mouse interactions to switch between tabs, reorder them, and close tabs as needed.
    - **Crucial Feature:** Tab management plays a pivotal role for users who regularly work with multiple websites simultaneously.
    - **Event Creation:** To implement these keyboard shortcuts, an event was created to facilitate the shifting of tabs among open windows based on specific key presses.
    - **User-Friendly Interaction:** Users can seamlessly switch tabs by pressing the designated shortcut keys, resulting in an improved browsing experience.
    - **Menu Items Implementation:** Menu items are employed to enable the functionality discussed above. They serve as triggers for specific events when clicked by the user.
- **Proxy Support:**
    - **Incorporated Proxy:** Wexond Browser distinguishes itself by incorporating support for a Las Vegas proxy, offering users the capability to modify their IP address and location. This feature enhances online privacy and grants access to geo-restricted content.
    - **User Configuration:** Users have the option to configure proxy settings directly within the browser, enabling them to route their web traffic through the Las Vegas proxy server.
    - **Implementation with proxy-chain Package:** To implement the proxy server functionality, the proxy-chain package was utilized.
    - **Utilization of os Package:** The os package was employed to verify the contents of incoming requests and to add proxy settings selectively if the request is of the IPv4 type.
    - **Proxy Server Setup:** A proxy server was set up, listening on port 8080, with the ability to forward incoming requests to an upstream proxy server equipped with authentication.
    - **Response Handling:** The proxy server is designed to handle responses from the target server, including the implementation of error-handling mechanisms.
    - **Verbose Logging:** To facilitate debugging, the proxy server is configured to enable verbose logging, providing detailed insights into its operations.
    - **Server Instance Availability:** The proxy server instance is made accessible for further utilization within the application, ensuring flexibility and extensibility in its use.
- **Implemented separate user data and sessions for each instance:**
    - **User Data and Session Separation:** In a browser application, segregating user data and sessions for each instance ensures that each user's interactions remain isolated from one another.
    - **Independence of Instances:** Each instance or user session operates independently, maintaining its distinct set of data and settings. This independence guarantees privacy and security for users.
    - **Preventing Data Interference:** This separation mechanism effectively prevents one user's actions from affecting or accessing the data or session of another user, preserving the integrity of each user's experience.
    - **Personalized User Experience:** The approach creates a personalized and tailored experience for every individual using the application.
    - **Essential for Privacy and Security:** Such separation is essential for upholding user privacy, ensuring data integrity, and maintaining robust security measures in multi-user web applications.
    - **Unique User Directories:** To implement this functionality, a unique time-stamped directory is generated for each user.
    - **Data Handling:** When such a directory already exists, the application writes data into the existing directory. If the directory is absent, a new one is created as needed.
    - **Cookies, Local Storage, and Sessions:** This approach enables the application to manage cookies, local storage, and sessions for each user separately, enhancing user-specific functionality and data management.


## Development Guidelines
1. **Coding Standards**

    ProxyBrowser has been meticulously developed, adhering to industry-leading coding practices, in order to uphold superior code quality  and long-term maintainability.
2. **Competitor**
   
    We utilize Git and GitHub for version control purposes.
3. **Code Review Process**
   
    For code review, we maintain an internal Slack channel dedicated to the process, where we request our team to review our code.
  
## Additional Resources
1. **Relevant Links**

    Please locate the links to the repositories:
   - [Fifo Browser Extended](https://github.com/qbatch/Fifo-Browser-Extended)
   - [Proxy Browser Backend](https://github.com/qbatch/proxy-browser-backend)
   - [Proxy Browser](https://github.com/qbatch/proxy-browser)
2. **Competitor**
   
    One of our primary competitors in the market is [Mirage ID](https://mirageid.com/)
