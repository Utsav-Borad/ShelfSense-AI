"""
Loads all products from every category.
"""

from master_data.dairy import DAIRY_PRODUCTS
from master_data.bakery import BAKERY_PRODUCTS
from master_data.beverages import BEVERAGE_PRODUCTS
from master_data.groceries import GROCERY_PRODUCTS
from master_data.snacks import SNACK_PRODUCTS
from master_data.personal_care import PERSONAL_CARE_PRODUCTS
from master_data.household import HOUSEHOLD_PRODUCTS
from master_data.medicine import MEDICINE_PRODUCTS
from master_data.frozen_food import FROZEN_PRODUCTS
from master_data.stationery import STATIONERY_PRODUCTS

ALL_PRODUCTS = (
    DAIRY_PRODUCTS
    + BAKERY_PRODUCTS
    + BEVERAGE_PRODUCTS
    + GROCERY_PRODUCTS
    + SNACK_PRODUCTS
    + PERSONAL_CARE_PRODUCTS
    + HOUSEHOLD_PRODUCTS
    + MEDICINE_PRODUCTS
    + FROZEN_PRODUCTS
    + STATIONERY_PRODUCTS
)