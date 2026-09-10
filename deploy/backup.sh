#!/bin/bash
set -euo pipefail

BACKUP_DIR="/var/backups/carebridge"
APP_DIR="/srv/carebridge/backend/server"
KEEP_DAYS=14
STAMP="$(date +%Y-%m-%d_%H-%M)"

mkdir -p "$BACKUP_DIR"

sudo -u postgres pg_dump carebridge | gzip > "$BACKUP_DIR/db_$STAMP.sql.gz"

tar -czf "$BACKUP_DIR/media_$STAMP.tar.gz" -C "$APP_DIR" media

find "$BACKUP_DIR" -name '*.gz' -mtime +$KEEP_DAYS -delete

echo "[$(date)] бекап готовий: db_$STAMP.sql.gz, media_$STAMP.tar.gz"
