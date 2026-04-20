## Getting Started
Install packages

```
npm install
```
Run project

```
npm start

## Technology Stack

- Node.js
- Redis
- Docker
- Open Street
- MVC Based

## Project Description

- .env file all the third party apis, tokens and db details inside this
- package.json all the packages and there version inside this
- src folder inside all the project structure
- src/modules folder all the modules of project here
- File Structure
  filename.controller.js (all the logic integrate inside this functions)
  filename.routes.js (all the url mension inside this to access apis)
  filename.service.js (all the sql queries inside this to add,edit,fetching and delete data from database)
  filename.validation.js (all the input validation inside this like required field,numeric field,limited digits validation for otp)
  
## Modules

- Login
  Admin Login using there credentials (all pages access)
  Manager Login using there username and password (only visualise page access and there profile section)
  
- Dashboard (Analytics)
  All the analytics data like pie chart,graph, progress meter with filter of state,city,area,today,weekly,monthly and yearly data filter
  Vendor Comparision show, Customer pickup time show,Occupency rate show,total lockers,avg pickup time show,total customers show,compartment size occupancy show 

- Dashboard (Visualise)
  All the Visualise data 
  Lockers show with there customer list ,transaction list and qr code download to onboarded customers
  Lockers show in new status
  Lockers show in healthy status
  Lockers show in functional issues status
  Lockers show in danger status 
  All the lockers show in map on there location

- Locker
  add locker ,fetching list of lockers
  After Locker add Unique locker code generate and qr code generate for onboarding locker customer
  Locker wise transactions listing show

- Locker Customer
  Add Customer using scan locker qr code and fill the form and otp verify then customer onboarding on our system for particular locker
  Locker wise customers listing show

- Ping Logs
  Add pinglogs using Locker code with online and offline status ,listing show

- Health Logs
  Add healthlogs using Locker code with healthy, critical and warning status ,listing show

- Transaction Logs
  Add transaction using Locker code,listing

- Users
  Add all the manager by admin ,edit ,delete and listing inside this
  After Add Login credentials get from there registered email id with username and password
  Manager only access for visualise page and edit there profile

- Profile
  Edit there personal info like name,mobile no ,address,profile image

## Developer 

- Dnyaneshwari (Software Developer)
  Pixel Values Technolabs
