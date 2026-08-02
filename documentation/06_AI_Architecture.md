####################################################################################################
# DOCUMENT INFORMATION
####################################################################################################

Project Name      : ShelfSense AI
Document          : 06_AI_Architecture.md
Version           : 1.0
Priority          : Highest
Depends On        : 00_AI_Master_Context.md
                    01_Project_Description.md
                    02_Business_Workflow.md
                    03_System_Architecture.md
                    04_Database_Design.md
                    05_API_Design.md

####################################################################################################
# PURPOSE
####################################################################################################

This document defines the Artificial Intelligence architecture of ShelfSense AI.

It specifies

• AI Philosophy
• Data Pipeline
• Feature Engineering
• Prediction Models
• Recommendation Engine
• Confidence Calculation
• Business Rules
• Future Model Expansion

The AI is designed to improve business decisions, not automate business operations.

####################################################################################################
# AI PHILOSOPHY
####################################################################################################

ShelfSense AI does not predict data.

ShelfSense AI predicts business outcomes.

The AI answers

"What should the owner do next?"

Instead of

"What happened?"

Every prediction must create measurable business value.

####################################################################################################
# AI OBJECTIVES
####################################################################################################

Primary Objectives

• Predict Product Demand

• Detect Dead Stock

• Estimate Inventory Loss

• Recommend Product Reordering

• Recommend Product Discounts

• Compare Supplier Performance

• Improve Inventory Turnover

Secondary Objectives

• Increase Profitability

• Reduce Waste

• Improve Decision Making

####################################################################################################
# AI PIPELINE
####################################################################################################

CSV Upload

↓

Database Synchronization

↓

Data Cleaning

↓

Feature Engineering

↓

Analytics

↓

Machine Learning

↓

Business Rules

↓

Recommendations

↓

Dashboard

↓

Email Notification

No model may use raw CSV directly.

####################################################################################################
# DATA SOURCES
####################################################################################################

AI reads only database tables.

Sales

Inventory

Purchase

Product

Supplier

Analytics

AI never reads uploaded CSV files.

####################################################################################################
# FEATURE ENGINEERING
####################################################################################################

Generated Features

Average Daily Sales

Weekly Sales

Monthly Sales

Stock Turnover Rate

Inventory Age

Days Until Expiry

Supplier Reliability

Purchase Frequency

Average Profit Margin

Sales Growth

Seasonality Index

Historical Demand

These features become the input for ML models.

####################################################################################################
# PREDICTION MODULES
####################################################################################################

Module 1

Demand Forecast

Output

Expected Future Sales

------------------------------------------------------------

Module 2

Dead Stock Detection

Output

Products with very low movement

------------------------------------------------------------

Module 3

Inventory Loss Prediction

Output

Expected financial loss

------------------------------------------------------------

Module 4

Discount Recommendation

Output

Suggested discount percentage

------------------------------------------------------------

Module 5

Reorder Recommendation

Output

Products requiring replenishment

------------------------------------------------------------

Module 6

Supplier Performance

Output

Supplier ranking

####################################################################################################
# MODEL SELECTION
####################################################################################################

Demand Forecast

Random Forest Regressor

Reason

Handles non-linear sales behaviour.

------------------------------------------------------------

Dead Stock

Random Forest Classifier

Reason

Works well on multiple inventory factors.

------------------------------------------------------------

Inventory Loss

Regression Model

Reason

Predicts expected monetary value.

------------------------------------------------------------

Supplier Performance

Weighted Scoring Algorithm

Reason

Business rules are more suitable than ML.

####################################################################################################
# BUSINESS RULE ENGINE
####################################################################################################

Machine Learning generates predictions.

Business Rules convert predictions into actions.

Example

Prediction

Demand increasing.

↓

Business Rule

Current inventory below minimum.

↓

Recommendation

Reorder within 5 days.

Business Rules always execute after ML.

####################################################################################################
# CONFIDENCE SCORE
####################################################################################################

Every recommendation includes

Prediction

Confidence

Business Reason

Expected Impact

Example

Recommendation

Increase Order Quantity

Confidence

91%

Reason

Sales increased for four consecutive weeks.

Expected Impact

Reduce stock-out risk.

####################################################################################################
# RECOMMENDATION FORMAT
####################################################################################################

Recommendation Type

Priority

Confidence

Business Reason

Suggested Action

Expected Benefit

Estimated Financial Impact

Every recommendation follows this structure.

####################################################################################################
# MODEL EXECUTION ORDER
####################################################################################################

Demand Forecast

↓

Dead Stock

↓

Inventory Loss

↓

Discount Recommendation

↓

Supplier Evaluation

↓

Recommendation Generation

####################################################################################################
# MODEL RETRAINING
####################################################################################################

Current Version

Static Model

Training performed offline.

Future Version

Scheduled Retraining

Weekly

Monthly

Quarterly

####################################################################################################
# AI LIMITATIONS
####################################################################################################

AI cannot

Predict market shocks.

Understand festivals automatically.

Know competitor pricing.

Replace owner experience.

AI provides recommendations only.

####################################################################################################
# EXPLAINABLE AI
####################################################################################################

Every recommendation must explain

Why it was generated.

Example

Product

Bread

Recommendation

Increase Inventory

Reason

Sales increased by 34%.

Current inventory below average demand.

Confidence

93%

The owner should always understand the recommendation.

####################################################################################################
# DASHBOARD OUTPUT
####################################################################################################

Demand Forecast

Inventory Risk

Dead Stock

Expected Loss

Discount Opportunities

Supplier Ranking

Business Health Score

These become dashboard widgets.

####################################################################################################
# EMAIL OUTPUT
####################################################################################################

High Priority Recommendations

Near Expiry Alerts

Low Stock Alerts

Weekly Business Summary

Monthly AI Report

####################################################################################################
# FUTURE AI FEATURES
####################################################################################################

Seasonal Forecasting

Customer Segmentation

Dynamic Pricing

Sales Anomaly Detection

Supplier Risk Prediction

Store Comparison

Cloud AI Models

LLM-based Business Assistant

####################################################################################################
# COMMON IMPLEMENTATION MISTAKES
####################################################################################################

Never train directly on raw CSV.

Never expose ML models to React.

Never modify business data automatically.

Never hide recommendation reasons.

Never generate recommendations without confidence scores.

####################################################################################################
# WHAT THIS DOCUMENT GUARANTEES
####################################################################################################

After reading this document

A developer understands

✔ AI Pipeline

✔ Feature Engineering

✔ Prediction Flow

✔ Recommendation Engine

✔ Confidence Calculation

✔ Dashboard Integration

✔ Future Expansion

####################################################################################################
# CODEX CONTEXT
####################################################################################################

Generate

Pandas Pipeline

Feature Engineering

ML Models

Prediction Services

Recommendation Engine

exactly according to this document.

Never expose ML implementation directly to frontend.

####################################################################################################
# CHATGPT CONTEXT
####################################################################################################

Future AI assistants should derive

ML Pipeline

Prediction Logic

Recommendation Engine

Business Rules

only from this document.

####################################################################################################
# FINAL PRINCIPLE
####################################################################################################

Artificial Intelligence is successful only when it helps the business owner make a better decision.

A highly accurate prediction with no business value is considered a failure.

####################################################################################################