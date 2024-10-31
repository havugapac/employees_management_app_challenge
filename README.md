## Employee Management System

An Employee Management System built with Node.js and NestJS for handling employee records, attendance tracking, and reporting. This application includes features like role-based access control, email notifications, and API documentation via Swagger.

## Table of Contents

Project Overview
Prerequisites
Installation
Configuration
Database Setup
Running the Application
Usage and API Documentation
Testing
Default Credentials
Technologies Used

# Project Overview

This Employee Management System is designed to streamline the management of employee data, attendance records, and reports. The application supports role-based access, automated email notifications, and has a comprehensive Swagger API documentation.


# Prerequisites

Ensure you have the following installed:
Node.js: v22 or higher
Redis: v6.2.0 or higher (for handling mail queues)
MySQL: Latest version recommended


# Installation

Clone the Repository:
git clone https://github.com/havugapac/employees_management_app_challenge.git

Navigate to the Project Directory:
cd <project-directory>

Install Dependencies: 
If you have npm installed:

npm install


# Set Up Environment Variables: 

Copy the .env.example file to create a new .env file and update it with your own configuration values.


# Configuration

Copy and configure environment variables as needed in the .env file and update all necessary credentials or configurations here.


# Database Setup

Generate Migrations: 
Run the following command to generate migrations:

npm run migration:generate src/db/migrations/<migration_name>

Replace <migration_name> with a name relevant to your migration.

Run Migrations: 
Apply migrations to the database:

npm run migration:run


# Running the Application

To start the application in development mode:
npm run start:dev


# Usage and API Documentation

After the server is running, you can access the API documentation at:
http://localhost:<port>/swagger

Replace <port> with the actual port your application is running on (default is usually 3000).


# Testing

Run unit tests with the following command:
npm run test


# Default Credentials

The application comes with a default user for initial login:
Email: vugapac@gmail.com
Password: admin@123


# Technologies Used

NestJS for backend framework
TypeORM for database ORM
MySQL for the relational database
Redis for managing mail queues
Swagger for API documentation

test pr

