####################################################################################################
# DOCUMENT INFORMATION
####################################################################################################

Project Name      : ShelfSense AI
Document          : 07_Development_Guide.md
Version           : 1.0
Priority          : Critical
Depends On        : 00_AI_Master_Context.md
                    01_Project_Description.md
                    02_Business_Workflow.md
                    03_System_Architecture.md
                    04_Database_Design.md
                    05_API_Design.md
                    06_AI_Architecture.md

####################################################################################################
# PURPOSE
####################################################################################################

This document defines how ShelfSense AI will be developed.

It specifies

• Development Order
• Team Responsibilities
• Coding Standards
• Git Workflow
• Module Dependencies
• Integration Strategy
• Testing Strategy

This document is the official implementation roadmap.

####################################################################################################
# DEVELOPMENT PHILOSOPHY
####################################################################################################

Build

Small

↓

Stable

↓

Integrated

↓

Tested

Never build everything together.

Every module must work independently before integration.

####################################################################################################
# TEAM STRUCTURE
####################################################################################################

Borad

Role

Frontend Lead

Responsibilities

React

UI

Dashboard

API Integration

Charts

------------------------------------------------------------

Kansara

Role

Backend Lead

Responsibilities

Django

Database

Authentication

REST APIs

Business Logic

------------------------------------------------------------

Thaker

Role

Analytics Lead

Responsibilities

CSV Engine

Pandas

Machine Learning

Reports

NodeMailer

####################################################################################################
# PROJECT PHASES
####################################################################################################

Phase 1

Project Setup

Deliverables

GitHub

Folder Structure

React

Django

Environment

------------------------------------------------------------

Phase 2

Authentication

Deliverables

Login

Register

JWT

Protected Routes

------------------------------------------------------------

Phase 3

Database

Deliverables

Models

Admin Panel

Relationships

Migrations

------------------------------------------------------------

Phase 4

CSV Synchronization

Deliverables

Upload

Validation

Synchronization

Database Update

------------------------------------------------------------

Phase 5

Dashboard

Deliverables

Cards

Tables

Charts

Reports

------------------------------------------------------------

Phase 6

Analytics

Deliverables

Business Metrics

KPIs

Reports

------------------------------------------------------------

Phase 7

Artificial Intelligence

Deliverables

Predictions

Recommendations

Confidence Scores

------------------------------------------------------------

Phase 8

Notifications

Deliverables

NodeMailer

Email Templates

SMTP

------------------------------------------------------------

Phase 9

Testing

Deliverables

Bug Fixes

Optimization

Documentation

####################################################################################################
# MODULE DEPENDENCIES
####################################################################################################

Authentication

↓

Database

↓

CSV Upload

↓

Analytics

↓

AI

↓

Dashboard

↓

Reports

↓

Notifications

Never violate this dependency order.

####################################################################################################
# DAILY DEVELOPMENT WORKFLOW
####################################################################################################

Step 1

Pull latest code.

↓

Step 2

Switch to personal feature branch.

↓

Step 3

Develop assigned module.

↓

Step 4

Test locally.

↓

Step 5

Commit changes.

↓

Step 6

Push to GitHub.

↓

Step 7

Create Pull Request.

↓

Step 8

Merge after review.

####################################################################################################
# CODING STANDARDS
####################################################################################################

Naming

PascalCase

React Components

camelCase

Variables

snake_case

Python Files

UPPER_CASE

Constants

No abbreviations.

Meaningful names only.

####################################################################################################
# DJANGO STANDARDS
####################################################################################################

Business logic belongs inside Services.

Views remain lightweight.

Models contain only data logic.

Use Django ORM.

Use Serializers.

Never write raw SQL.

Never place business logic inside Views.

####################################################################################################
# REACT STANDARDS
####################################################################################################

Components should be reusable.

Pages should remain lightweight.

Business logic belongs inside Services.

Use Axios for API calls.

Never hardcode API URLs.

Use Environment Variables.

####################################################################################################
# AI STANDARDS
####################################################################################################

Read from database only.

Never train on raw CSV.

Separate preprocessing.

Separate feature engineering.

Separate prediction logic.

Separate recommendation engine.

####################################################################################################
# FILE ORGANIZATION
####################################################################################################

One component

↓

One responsibility

------------------------------------------------------------

One API

↓

One View

------------------------------------------------------------

One Feature

↓

One Service

Never mix unrelated functionality.

####################################################################################################
# COMMIT MESSAGE FORMAT
####################################################################################################

feat:

New Feature

------------------------------------------------------------

fix:

Bug Fix

------------------------------------------------------------

refactor:

Improvement

------------------------------------------------------------

docs:

Documentation

------------------------------------------------------------

test:

Testing

------------------------------------------------------------

style:

Formatting

Example

feat: Added CSV Upload Module

####################################################################################################
# CODE REVIEW CHECKLIST
####################################################################################################

Before merging

✔ Code builds

✔ No warnings

✔ No duplicate logic

✔ Documentation updated

✔ API tested

✔ UI tested

✔ Database migration verified

####################################################################################################
# TESTING CHECKLIST
####################################################################################################

Authentication

CSV Upload

Database

Dashboard

Analytics

AI

Email

Reports

API Security

Frontend

Every module must be tested independently.

####################################################################################################
# INTEGRATION PLAN
####################################################################################################

Step 1

Frontend + Authentication

↓

Step 2

Authentication + Database

↓

Step 3

Database + CSV

↓

Step 4

CSV + Analytics

↓

Step 5

Analytics + AI

↓

Step 6

AI + Dashboard

↓

Step 7

Dashboard + Notifications

Integration happens gradually.

####################################################################################################
# PROJECT TIMELINE
####################################################################################################

Week 1

Project Setup

------------------------------------------------------------

Week 2

Authentication

------------------------------------------------------------

Week 3

Database

------------------------------------------------------------

Week 4

CSV Engine

------------------------------------------------------------

Week 5

Dashboard

------------------------------------------------------------

Week 6

Analytics

------------------------------------------------------------

Week 7

AI

------------------------------------------------------------

Week 8

Notifications

------------------------------------------------------------

Week 9

Testing

####################################################################################################
# COMMON DEVELOPMENT MISTAKES
####################################################################################################

Do not build frontend before APIs exist.

Do not train AI before analytics exist.

Do not skip testing.

Do not merge broken code.

Do not bypass architecture.

Do not commit directly to main.

####################################################################################################
# WHAT THIS DOCUMENT GUARANTEES
####################################################################################################

After reading this document

A developer understands

✔ Development order

✔ Coding standards

✔ Integration sequence

✔ Team responsibilities

✔ Testing strategy

✔ Project roadmap

####################################################################################################
# CODEX CONTEXT
####################################################################################################

Generate production-quality code.

Implement only one phase at a time.

Never skip dependencies.

Respect architecture.

Follow coding standards.

####################################################################################################
# CHATGPT CONTEXT
####################################################################################################

Future AI assistants should generate

Tasks

Milestones

Development Plans

Module Breakdown

only according to this guide.

####################################################################################################
# FINAL PRINCIPLE
####################################################################################################

The objective is not to finish quickly.

The objective is to build a maintainable, modular and production-quality application.

####################################################################################################