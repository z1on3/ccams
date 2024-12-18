-- Add new columns to farmers table if they do not exist
ALTER TABLE farmers
ADD COLUMN IF NOT EXISTS farm_ownership_type ENUM('Land Owner', 'Tenant') DEFAULT NULL AFTER farm_owner,
ADD COLUMN IF NOT EXISTS farmer_type JSON DEFAULT NULL AFTER farm_ownership_type;

-- Update existing records to have default values
UPDATE farmers 
SET farm_ownership_type = CASE 
    WHEN farm_owner = 1 THEN 'Land Owner'
    ELSE 'Tenant'
END,
farmer_type = '[]';

-- Add indexes for the new columns if they do not exist
ALTER TABLE farmers
ADD INDEX IF NOT EXISTS idx_farm_ownership_type (farm_ownership_type),
ADD INDEX IF NOT EXISTS idx_farmer_type (farmer_type);
