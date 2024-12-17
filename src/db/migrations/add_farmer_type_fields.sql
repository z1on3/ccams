-- Add new columns to farmers table if they do not exist
SET @column_exists = (SELECT COUNT(*) 
                      FROM information_schema.COLUMNS 
                      WHERE TABLE_NAME='farmers' 
                      AND COLUMN_NAME='farm_ownership_type');

IF @column_exists = 0 THEN
    ALTER TABLE farmers
    ADD COLUMN farm_ownership_type ENUM('Land Owner', 'Tenant') DEFAULT NULL AFTER farm_owner;
END IF;

SET @column_exists = (SELECT COUNT(*) 
                      FROM information_schema.COLUMNS 
                      WHERE TABLE_NAME='farmers' 
                      AND COLUMN_NAME='farmer_type');

IF @column_exists = 0 THEN
    ALTER TABLE farmers
    ADD COLUMN farmer_type JSON DEFAULT NULL AFTER farm_ownership_type;
END IF;

-- Update existing records to have default values
UPDATE farmers 
SET farm_ownership_type = CASE 
    WHEN farm_owner = 1 THEN 'Land Owner'
    ELSE 'Tenant'
END,
farmer_type = '[]';

-- Add indexes for the new columns
ALTER TABLE farmers
ADD INDEX idx_farm_ownership_type (farm_ownership_type),
ADD INDEX idx_farmer_type (farmer_type);