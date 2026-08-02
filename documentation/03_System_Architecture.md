####################################################################################################
# DOCUMENT INFORMATION
####################################################################################################

Project Name      : ShelfSense AI
Document          : 03_System_Architecture.md
Version           : 1.0
Priority          : Critical
Depends On        : 00_AI_Master_Context.md
                    01_Project_Description.md
                    02_Business_Workflow.md

####################################################################################################
# PURPOSE
####################################################################################################

This document defines the complete software architecture of ShelfSense AI.

It specifies

• System Layers
• Module Responsibilities
• Internal Communication
• Folder Ownership
• Technology Boundaries
• Security Rules
• Deployment Strategy

Every implementation must follow this architecture.

####################################################################################################
# AI INSTRUCTIONS
####################################################################################################

If you are an AI Assistant

(ChatGPT, Codex, Cursor, Claude, Gemini...)

Follow this architecture exactly.

Never

• Mix responsibilities
• Skip Django
• Access SQLite from React
• Access AI directly from React
• Place business logic inside frontend

If implementation conflicts with this document,

this document is correct.

####################################################################################################
# ARCHITECTURE STYLE
####################################################################################################

Architecture Pattern

Layered Modular Architecture

Presentation Layer

↓

API Layer

↓

Business Logic Layer

↓

Data Layer

↓

Analytics Layer

↓

AI Layer

↓

Notification Layer

Every layer has exactly one responsibility.

####################################################################################################
# COMPLETE SYSTEM ARCHITECTURE
####################################################################################################

                    SHOP OWNER

                         │

                         ▼

                React Frontend (Vite)

                         │

                 Axios REST Requests

                         │

                         ▼

             Django REST Framework API

                         │

        ┌─────────────────────────────────────┐

        │                                     │

Authentication                  Business Modules

        │                                     │

        └─────────────────────────────────────┘

                         │

                 Business Logic Layer

                         │

                 CSV Processing Engine

                         │

                 SQLite Database

                         │

                  Analytics Engine

                         │

                 AI Decision Engine

                         │

             Recommendation Generator

                         │

               Notification Service

                         │

              Node.js + Nodemailer

                         │

                     Email Owner

####################################################################################################
# SYSTEM LAYERS
####################################################################################################

Layer 1

Presentation

Technology

React

Purpose

User Interface

------------------------------------------------------------

Layer 2

Communication

Technology

REST API

Purpose

Frontend ↔ Backend

------------------------------------------------------------

Layer 3

Application

Technology

Django

Purpose

Business Logic

------------------------------------------------------------

Layer 4

Persistence

Technology

SQLite

Purpose

Store Business Data

------------------------------------------------------------

Layer 5

Analytics

Technology

Pandas

Purpose

Generate Business Metrics

------------------------------------------------------------

Layer 6

Artificial Intelligence

Technology

Scikit-Learn

Purpose

Generate Business Recommendations

------------------------------------------------------------

Layer 7

Notification

Technology

Node.js

Purpose

Email Delivery

####################################################################################################
# FRONTEND ARCHITECTURE
####################################################################################################

Responsibilities

Authentication UI

Dashboard

CSV Upload

Inventory

Analytics

Reports

AI Insights

Settings

Profile

Never Responsible For

Business Logic

Database

Machine Learning

CSV Processing

Authentication Rules

Folder Ownership

frontend/

####################################################################################################
# BACKEND ARCHITECTURE
####################################################################################################

Responsibilities

Authentication

Authorization

Business Logic

CSV Validation

Database Operations

Analytics Execution

AI Execution

Notification Requests

REST APIs

Backend becomes the system controller.

Everything passes through Django.

####################################################################################################
# ANALYTICS ARCHITECTURE
####################################################################################################

Input

Database

↓

Cleaning

↓

Aggregation

↓

Business Metrics

↓

Dashboard

Analytics never reads directly from uploaded CSV.

Analytics always reads synchronized database data.

####################################################################################################
# AI ARCHITECTURE
####################################################################################################

Input

Historical Sales

Inventory

Purchases

Supplier Performance

Business Trends

↓

Prediction Models

↓

Recommendations

↓

Dashboard

↓

Email

AI never updates database directly.

AI generates recommendations only.

####################################################################################################
# NOTIFICATION ARCHITECTURE
####################################################################################################

Django

↓

REST Request

↓

Node.js

↓

Email Template

↓

SMTP

↓

Owner

Node.js never communicates with SQLite.

####################################################################################################
# MODULE COMMUNICATION
####################################################################################################

React

↓

REST API

↓

Django

↓

SQLite

↓

Analytics

↓

AI

↓

Node.js

↓

Email

Modules never skip intermediate layers.

####################################################################################################
# REQUEST LIFE CYCLE
####################################################################################################

User Action

↓

React

↓

Axios

↓

REST API

↓

Authentication

↓

Business Logic

↓

Database

↓

Response

↓

React

####################################################################################################
# CSV LIFE CYCLE
####################################################################################################

Upload

↓

Validation

↓

Cleaning

↓

Transformation

↓

Synchronization

↓

Analytics

↓

AI

↓

Dashboard

↓

Notification

Every uploaded file follows this lifecycle.

####################################################################################################
# TECHNOLOGY RESPONSIBILITY
####################################################################################################

React

Owns

UI

------------------------------------------------------------

Axios

Owns

Communication

------------------------------------------------------------

Django

Owns

Business Logic

------------------------------------------------------------

SQLite

Owns

Business Data

------------------------------------------------------------

Pandas

Owns

Business Analytics

------------------------------------------------------------

Scikit-Learn

Owns

Predictions

------------------------------------------------------------

Node.js

Owns

Emails

####################################################################################################
# PROJECT FOLDER ARCHITECTURE
####################################################################################################

ShelfSense-AI/

│

├── frontend/

│

├── backend/

│

├── datasets/

│

├── documentation/

│

└── README.md

------------------------------------------------------------

frontend/

assets/

components/

context/

hooks/

layouts/

pages/

routes/

services/

styles/

utils/

------------------------------------------------------------

backend/

authentication/

accounts/

inventory/

sales/

suppliers/

analytics/

ai_engine/

notifications/

reports/

config/

####################################################################################################
# MODULE DEPENDENCY
####################################################################################################

Authentication

↓

CSV Engine

↓

Inventory

↓

Analytics

↓

AI

↓

Reports

↓

Notifications

Upper modules never depend on lower modules.

####################################################################################################
# SECURITY ARCHITECTURE
####################################################################################################

Authentication

JWT

------------------------------------------------------------

Authorization

Role Based

------------------------------------------------------------

Passwords

Hashed

------------------------------------------------------------

Database

ORM Protected

------------------------------------------------------------

Uploads

Validated

------------------------------------------------------------

Environment Variables

Secrets Stored Outside Code

####################################################################################################
# DEPLOYMENT ARCHITECTURE
####################################################################################################

Client

↓

React

↓

Django API

↓

SQLite

↓

Node.js Email Service

Future

SQLite

↓

PostgreSQL

No frontend changes required.

####################################################################################################
# ARCHITECTURE DECISIONS
####################################################################################################

Decision

React never accesses database.

Reason

Security

Implementation

REST APIs only.

------------------------------------------------------------

Decision

Business logic exists only in Django.

Reason

Single Responsibility

------------------------------------------------------------

Decision

Analytics starts only after synchronization.

Reason

Data Consistency

------------------------------------------------------------

Decision

AI starts only after analytics.

Reason

Reliable Predictions

------------------------------------------------------------

Decision

Node.js only sends emails.

Reason

Microservice Isolation

####################################################################################################
# MODULE OWNERSHIP
####################################################################################################

Borad

Frontend

------------------------------------------------------------

Kansara

Backend

------------------------------------------------------------

Thaker

Analytics

AI

Reports

Notifications

####################################################################################################
# COMMON IMPLEMENTATION MISTAKES
####################################################################################################

Never

Access SQLite from React.

Never

Generate AI from uploaded CSV.

Never

Store ML inside frontend.

Never

Duplicate business logic.

Never

Allow Node.js database access.

Never

Skip validation.

####################################################################################################
# WHAT THIS DOCUMENT GUARANTEES
####################################################################################################

After reading this document

A developer understands

✔ Complete architecture

✔ Module responsibilities

✔ Communication rules

✔ Technology boundaries

✔ Folder ownership

✔ Layer interactions

✔ Security strategy

Database Design can now begin.

####################################################################################################
# CODEX CONTEXT
####################################################################################################

Generate code according to this architecture.

Never

• Merge modules

• Mix responsibilities

• Bypass REST APIs

Generate production-quality, modular code.

####################################################################################################
# CHATGPT CONTEXT
####################################################################################################

Future AI assistants should derive

Database

REST APIs

Folder Structure

Development Guide

only from this architecture.

This architecture is frozen.

####################################################################################################
# FINAL PRINCIPLE
####################################################################################################

ShelfSense AI is composed of independent modules communicating through well-defined interfaces.

Every future feature must integrate into the existing architecture instead of modifying it.

####################################################################################################