#!/bin/bash

# Database backup script for JETDESTEK Platform
# This script creates daily backups of the PostgreSQL database

set -e

# Configuration
DB_NAME="jetdestek_prod"
DB_USER="jetdestek"
DB_HOST="postgres"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
echo "Starting database backup at $(date)"
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove old backups (older than retention days)
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
echo "Old backups cleaned up (retention: $RETENTION_DAYS days)"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# aws s3 cp "${BACKUP_FILE}.gz" s3://your-backup-bucket/database-backups/

