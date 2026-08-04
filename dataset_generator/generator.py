"""
Main Dataset Generator
"""
from master_data.all_products import ALL_PRODUCTS
from generators.business_generator import generate_business_csv
from generators.category_generator import generate_category_csv
from generators.supplier_generator import generate_supplier_csv
from generators.product_generator import generate_product_csv
from generators.inventory_generator import generate_inventory_csv
from generators.sales_generator import generate_sales_csv

def main():

    print("=" * 60)
    print("ShelfSense AI Dataset Generator")
    print("=" * 60)

    print(f"Total Products Loaded : {len(ALL_PRODUCTS)}")

    print()

    generate_business_csv()
    generate_category_csv()
    generate_supplier_csv()
    generate_product_csv()
    generate_inventory_csv()
    generate_sales_csv()

    print()
    print("Generator Initialized Successfully.")


if __name__ == "__main__":
    main()