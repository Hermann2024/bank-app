-- Script de création des bases et utilisateurs PostgreSQL pour les microservices

-- User Service
CREATE DATABASE userdb;
CREATE USER user WITH ENCRYPTED PASSWORD 'userpass';
GRANT ALL PRIVILEGES ON DATABASE userdb TO user;

-- Account Service
CREATE DATABASE accountdb;
CREATE USER account WITH ENCRYPTED PASSWORD 'accountpass';
GRANT ALL PRIVILEGES ON DATABASE accountdb TO account;

-- Transaction Service
CREATE DATABASE transactiondb;
CREATE USER transaction WITH ENCRYPTED PASSWORD 'transactionpass';
GRANT ALL PRIVILEGES ON DATABASE transactiondb TO transaction;

-- Card Service
CREATE DATABASE carddb;
CREATE USER card WITH ENCRYPTED PASSWORD 'cardpass';
GRANT ALL PRIVILEGES ON DATABASE carddb TO card;

-- Loan Service
CREATE DATABASE loandb;
CREATE USER loan WITH ENCRYPTED PASSWORD 'loanpass';
GRANT ALL PRIVILEGES ON DATABASE loandb TO loan;

-- Notification Service
CREATE DATABASE notificationdb;
CREATE USER notification WITH ENCRYPTED PASSWORD 'notificationpass';
GRANT ALL PRIVILEGES ON DATABASE notificationdb TO notification; 