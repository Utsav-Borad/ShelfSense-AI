####################################################################################################
# DOCUMENT INFORMATION
####################################################################################################

Project Name    : ShelfSense AI
Version         : 1.0
Document        : 01_Project_Description.md
Document Owner  : Team ShelfSense AI
Prepared By     : Team ShelfSense AI
Status          : Active
Last Updated    : 02-Aug-2026

####################################################################################################
# AI CONTEXT (READ FIRST)
####################################################################################################

This document is the authoritative specification of the project.

If you are an AI Assistant (ChatGPT, Codex, Cursor AI, Claude, Gemini or any coding assistant):

• Read this document completely before generating code.
• Follow every architectural decision documented here.
• Do NOT redesign the project unless explicitly instructed.
• Do NOT convert this project into a POS or Billing System.
• CSV Synchronization is the official integration method.
• AI exists for Decision Support, not for Billing.
• If your generated solution conflicts with this document, this document wins.

####################################################################################################
# 1. PROJECT OVERVIEW
####################################################################################################

Project Name

ShelfSense AI

Tagline

Transforming Sales Data into Smarter Inventory Decisions.

Project Type

AI Powered Inventory Decision Support Platform

Category

Retail Business Intelligence

Target Platform

Web Application

Development Type

Semester 4 Major Project

####################################################################################################
# 2. VISION
####################################################################################################

ShelfSense AI is not another Inventory Management Software.

ShelfSense AI is not another Billing Software.

ShelfSense AI is not another POS System.

ShelfSense AI works WITH existing POS software.

Its purpose is to convert raw inventory and sales data into intelligent business decisions using Artificial Intelligence and Data Analytics.

The system should behave like an Inventory Consultant rather than an Inventory Register.

####################################################################################################
# 3. PROBLEM STATEMENT
####################################################################################################

Small and medium retail stores already use POS software for:

• Billing
• Stock Entry
• Barcode Scanning
• GST
• Invoice Generation

These systems successfully answer

"What happened?"

Examples

• What sold today?
• Current stock?
• Total sales?
• Revenue?

However they fail to answer

"What should happen next?"

Examples

• Which products should be reordered?
• Which products are becoming dead stock?
• Which supplier performs better?
• What inventory decision minimizes loss?
• What is the expected inventory loss?
• Which products deserve discounts?
• Which products should not be purchased again?

These decisions are currently taken using experience instead of data.

ShelfSense AI solves this gap.

####################################################################################################
# 4. PROJECT PHILOSOPHY
####################################################################################################

Core Philosophy

Recording data is easy.

Making decisions from data is difficult.

Existing software records.

ShelfSense AI recommends.

Our objective is not automation.

Our objective is Decision Intelligence.

####################################################################################################
# 5. WHY WE ARE NOT BUILDING A POS SYSTEM
####################################################################################################

Decision

ShelfSense AI will NEVER perform billing.

Reason

Existing POS software already performs billing efficiently.

Rebuilding a POS software would

• Increase project complexity
• Duplicate existing solutions
• Reduce AI importance
• Move outside Semester scope

Therefore

ShelfSense AI begins after billing is completed.

####################################################################################################
# 6. WHY CSV SYNCHRONIZATION
####################################################################################################

Decision

CSV is the official communication layer between POS and ShelfSense AI.

Reason

Every POS software can export reports.

CSV provides

• Vendor Independence
• Easy Integration
• Offline Compatibility
• Semester Level Complexity
• Universal Support

Supported CSV Types

1. Sales Report

2. Inventory Report

3. Purchase Report

Future

Direct API Integration can replace CSV without changing project architecture.

####################################################################################################
# 7. PROJECT WORKFLOW
####################################################################################################

Supplier

↓

Products Entered in POS

↓

Barcode Billing

↓

Daily CSV Export

↓

ShelfSense AI

↓

Data Validation

↓

SQLite Update

↓

Analytics

↓

AI Decision Engine

↓

Recommendations

↓

Dashboard

↓

Email Notifications

####################################################################################################
# 8. TARGET USERS
####################################################################################################

Primary Users

• Grocery Stores

• Medical Stores

• Bakeries

• Dairy Stores

• Cosmetic Stores

• Organic Food Stores

• Frozen Food Stores

• Pet Food Stores

Selection Rule

Any business selling products having

• Manufacturing Date

and

• Expiry Date

####################################################################################################
# 9. WHAT SHELFSENSE AI DOES
####################################################################################################

ShelfSense AI receives business data.

ShelfSense AI cleans the data.

ShelfSense AI analyzes the data.

ShelfSense AI predicts business outcomes.

ShelfSense AI recommends better inventory decisions.

ShelfSense AI does NOT modify business operations automatically.

Final decisions always remain with the owner.

####################################################################################################
# 10. WHAT MAKES THIS PROJECT DIFFERENT
####################################################################################################

Traditional Inventory Software

↓

Shows Reports

ShelfSense AI

↓

Explains Reports

↓

Predicts Outcomes

↓

Recommends Decisions

↓

Estimates Financial Impact

This is an AI Decision Support Platform.

Not a reporting software.

####################################################################################################
# 11. CORE OBJECTIVES
####################################################################################################

Primary Objectives

• Reduce inventory wastage

• Improve purchasing decisions

• Forecast demand

• Estimate inventory loss

• Recommend discounts

• Identify dead stock

• Evaluate supplier performance

• Improve profitability

Secondary Objectives

• Interactive Dashboard

• Automated Reports

• Email Notifications

• Business Analytics

####################################################################################################
# 12. PROJECT BOUNDARIES
####################################################################################################

ShelfSense AI WILL

✔ Import CSV Reports

✔ Maintain SQLite Database

✔ Generate Analytics

✔ Perform AI Analysis

✔ Recommend Decisions

✔ Send Notifications

ShelfSense AI WILL NOT

✘ Generate Bills

✘ Print Invoices

✘ Replace POS

✘ Scan Products

✘ Handle Payments

####################################################################################################
# 13. PROJECT SUCCESS CRITERIA
####################################################################################################

The project is considered successful if it can

1.

Import business reports.

2.

Synchronize SQLite Database.

3.

Generate meaningful analytics.

4.

Produce AI recommendations.

5.

Display interactive dashboard.

6.

Notify owner through email.

If these six goals are achieved,

the project objective is fulfilled.

####################################################################################################
# 14. TEAM RESPONSIBILITIES
####################################################################################################

Utsav Borad

Frontend Lead

Responsibilities

• React

• Bootstrap

• UI

• Dashboard

• Routing

• API Integration

Folder Ownership

frontend/

------------------------------------------

Kansara

Backend Lead

Responsibilities

• Django

• DRF

• Authentication

• SQLite

• APIs

• Database

Folder Ownership

backend/

------------------------------------------

Thaker

Analytics Lead

Responsibilities

• CSV Engine

• Pandas

• Reports

• AI Models

• Node.js

• Nodemailer

Folder Ownership

analytics/

datasets/

notifications/

####################################################################################################
# 15. DEVELOPMENT PRINCIPLES
####################################################################################################

Every module should satisfy

Single Responsibility

Loose Coupling

Reusable Components

Scalable Folder Structure

REST API Communication

No Duplicate Logic

No Hardcoded Values

Configuration Through Environment Variables

####################################################################################################
# 16. MAJOR DECISIONS TAKEN
####################################################################################################

Decision 01

We are not building POS software.

------------------------------------------------

Decision 02

CSV Synchronization is official.

------------------------------------------------

Decision 03

AI performs Decision Support.

------------------------------------------------

Decision 04

SQLite is official database.

------------------------------------------------

Decision 05

React communicates only through REST APIs.

------------------------------------------------

Decision 06

Node.js exists only for Email Service.

------------------------------------------------

Decision 07

Every teammate owns separate modules.

####################################################################################################
# 17. FUTURE EXPANSION
####################################################################################################

Possible Improvements

• Live POS APIs

• Mobile App

• OCR Invoice Reader

• Barcode Scanner

• QR Inventory

• WhatsApp Alerts

• Supplier Portal

• Multi Store Management

• Cloud Deployment

####################################################################################################
# CODEX CONTEXT
####################################################################################################

When generating code

Follow this document.

Do not invent architecture.

Implement only requested module.

Never modify folder ownership.

Never replace CSV synchronization.

Prefer modular and production-ready code.

####################################################################################################
# CHATGPT CONTEXT
####################################################################################################

If this document is uploaded into a new conversation,

assume

• This document is the latest project specification.

• Missing technical details should remain consistent with this document.

• Never contradict architectural decisions without explicit instruction.

####################################################################################################
# TEAM NOTES
####################################################################################################

This document is the Constitution of the project.

Every design decision must first be updated here.

Only then should code be modified.

Documentation has higher priority than implementation.

####################################################################################################