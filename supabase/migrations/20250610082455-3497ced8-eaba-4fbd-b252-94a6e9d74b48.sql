
-- Add primary key columns to all tables and enable proper upsert behavior

-- Add primary key to action_log table
ALTER TABLE action_log ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to bookies_data table  
ALTER TABLE bookies_data ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to comments_notes table
ALTER TABLE comments_notes ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to deliverables_status table
ALTER TABLE deliverables_status ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to general_info table (it doesn't have one yet)
ALTER TABLE general_info ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to material_procurement table
ALTER TABLE material_procurement ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to milestones table
ALTER TABLE milestones ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to risks table
ALTER TABLE risks ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add primary key to service_procurement table
ALTER TABLE service_procurement ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
