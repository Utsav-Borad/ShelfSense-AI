####################################################################################################
# DOCUMENT INFORMATION
####################################################################################################

Project Name      : ShelfSense AI
Document          : 02_Business_Workflow.md
Version           : 1.0
Priority          : High
Depends On        : 00_AI_Master_Context.md
                    01_Project_Description.md

####################################################################################################
# PURPOSE
####################################################################################################

This document defines how the business operates.

It does NOT describe code.

It describes

Business

↓

Data

↓

Decision

Every database table, REST API, dashboard page and AI model must follow this workflow.

####################################################################################################
# AI INSTRUCTIONS
####################################################################################################

If you are an AI assistant:

Do not invent another workflow.

Every implementation must respect this document.

The workflow is business-driven.

Technology should adapt to the workflow.

Never redesign the workflow without updating this document.

####################################################################################################
# BUSINESS LIFE CYCLE
####################################################################################################

Supplier

↓

Store Owner

↓

POS Software

↓

CSV Reports

↓

ShelfSense AI

↓

Analytics

↓

AI Engine

↓

Recommendations

↓

Owner Decision

↓

Business Improvement

####################################################################################################
# DAILY BUSINESS FLOW
####################################################################################################

STEP 1

Products arrive from suppliers.

Owner enters purchase details into POS.

ShelfSense AI is NOT involved.

------------------------------------------------------------

STEP 2

Products are stored on shelves.

Customers purchase products.

Billing is completed.

ShelfSense AI is NOT involved.

------------------------------------------------------------

STEP 3

At the end of the day,

POS exports reports.

Sales Report

Inventory Report

Purchase Report

CSV format.

This is the official entry point of ShelfSense AI.

------------------------------------------------------------

STEP 4

Owner logs into ShelfSense AI.

Uploads exported CSV files.

No manual inventory entry.

No duplicate work.

------------------------------------------------------------

STEP 5

ShelfSense AI validates uploaded files.

Checks

• Required columns

• Missing values

• Duplicate records

• Invalid dates

• Invalid quantities

Invalid files are rejected.

####################################################################################################
# DATA SYNCHRONIZATION FLOW
####################################################################################################

CSV Upload

↓

Validation

↓

Cleaning

↓

Transformation

↓

Database Synchronization

↓

Analytics Update

↓

AI Processing

↓

Dashboard Refresh

This sequence must never change.

####################################################################################################
# DATABASE SYNCHRONIZATION
####################################################################################################

Sales CSV

↓

Sales Table

------------------------------------------------------------

Inventory CSV

↓

Inventory Table

------------------------------------------------------------

Purchase CSV

↓

Purchase Table

The uploaded CSV becomes the source of truth.

####################################################################################################
# ANALYTICS WORKFLOW
####################################################################################################

Once synchronization completes,

Analytics Engine starts automatically.

Calculates

Current Stock

Inventory Value

Revenue

Profit Estimate

Fast Moving Products

Slow Moving Products

Dead Stock

Near Expiry Stock

Supplier Statistics

Monthly Trends

Outputs are stored for dashboard visualization.

####################################################################################################
# AI WORKFLOW
####################################################################################################

AI starts ONLY after analytics.

Input

Historical Sales

Inventory

Purchases

Supplier Data

Expiry Data

Business Trends

↓

Processing

↓

Predictions

↓

Recommendations

AI never reads raw CSV directly.

AI always works with cleaned database data.

####################################################################################################
# RECOMMENDATION WORKFLOW
####################################################################################################

AI generates

Demand Forecast

↓

Reorder Suggestion

↓

Expected Inventory Loss

↓

Discount Suggestion

↓

Dead Stock Warning

↓

Supplier Performance

↓

Business Insights

Recommendations never modify business data.

Recommendations are advisory only.

####################################################################################################
# EMAIL WORKFLOW
####################################################################################################

Django decides

↓

Node.js receives request

↓

Email Template Generated

↓

SMTP Delivery

↓

Owner receives notification

Email examples

Low Stock

Near Expiry

Weekly Summary

Monthly Report

####################################################################################################
# OWNER DECISION FLOW
####################################################################################################

Dashboard

↓

Analytics

↓

AI Recommendation

↓

Owner Reviews

↓

Owner Takes Action

↓

Next Day Business

↓

New CSV

↓

Continuous Improvement

ShelfSense AI never performs actions automatically.

####################################################################################################
# BUSINESS RULES
####################################################################################################

Rule 1

Every uploaded CSV represents one business snapshot.

------------------------------------------------------------

Rule 2

Historical data must never be deleted.

------------------------------------------------------------

Rule 3

Analytics depends on synchronized database.

------------------------------------------------------------

Rule 4

AI depends on analytics.

------------------------------------------------------------

Rule 5

Emails depend on AI output.

####################################################################################################
# MODULE EXECUTION ORDER
####################################################################################################

Authentication

↓

CSV Upload

↓

Validation

↓

Synchronization

↓

Analytics

↓

AI

↓

Reports

↓

Email

Never change this execution order.

####################################################################################################
# ERROR FLOW
####################################################################################################

CSV Invalid

↓

Reject Upload

↓

Show Validation Errors

↓

Owner Corrects File

↓

Upload Again

No partial synchronization.

####################################################################################################
# DATA OWNERSHIP
####################################################################################################

POS

Owns Raw Business Data

------------------------------------------------------------

ShelfSense AI

Owns Analytics

Predictions

Recommendations

Reports

------------------------------------------------------------

Owner

Owns Final Business Decision

####################################################################################################
# PROJECT MODULES
####################################################################################################

Module 1

Authentication

------------------------------------------------------------

Module 2

Business Setup

------------------------------------------------------------

Module 3

CSV Synchronization Center

------------------------------------------------------------

Module 4

Inventory Intelligence

------------------------------------------------------------

Module 5

Analytics Engine

------------------------------------------------------------

Module 6

AI Decision Engine

------------------------------------------------------------

Module 7

Reports

------------------------------------------------------------

Module 8

Notification Service

####################################################################################################
# PROJECT DASHBOARD FLOW
####################################################################################################

Login

↓

Upload CSV

↓

Synchronization Status

↓

Dashboard

↓

Inventory

↓

Analytics

↓

AI Insights

↓

Reports

↓

Notifications

####################################################################################################
# WHAT THIS DOCUMENT GUARANTEES
####################################################################################################

After reading this document,

a developer understands

✔ Business lifecycle

✔ Daily workflow

✔ CSV flow

✔ Analytics flow

✔ AI flow

✔ Notification flow

✔ Module sequence

✔ Data ownership

Database design should now become straightforward.

####################################################################################################
# COMMON IMPLEMENTATION MISTAKES
####################################################################################################

Do NOT allow AI before analytics.

Do NOT allow analytics before synchronization.

Do NOT bypass validation.

Do NOT edit raw CSV.

Do NOT update database partially.

Do NOT allow React to process CSV.

####################################################################################################
# CODEX CONTEXT
####################################################################################################

Implement the project exactly in this sequence.

Business Workflow

↓

Database

↓

REST APIs

↓

Frontend

↓

AI

↓

Notifications

Never change execution order.

####################################################################################################
# CHATGPT CONTEXT
####################################################################################################

Future AI assistants should derive

Database Design

REST APIs

Frontend Pages

Machine Learning Pipeline

only from this workflow.

Never invent additional workflow unless explicitly instructed.

####################################################################################################
# FINAL PRINCIPLE
####################################################################################################

ShelfSense AI does not improve businesses by recording more data.

ShelfSense AI improves businesses by transforming existing business data into better business decisions.

Every future feature must support this principle.

####################################################################################################