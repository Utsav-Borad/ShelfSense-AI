# ShelfSense AI datasets

`templates/` contains the canonical Sales, Inventory, and Purchase CSV formats
accepted by the Analytics CSV Engine. Use these as the POS export mapping
templates. Do not place real customer data in the repository.

`samples/valid/` contains mock data for later end-to-end synchronization and
analytics tests. It models low-stock, near-expiry, slow-moving, and normal
inventory situations. `samples/invalid/` contains deliberately rejected files
for CSV validation testing.
