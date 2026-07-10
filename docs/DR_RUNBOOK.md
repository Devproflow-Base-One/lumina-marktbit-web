# LUMINA OVERMIND — DR RUNBOOK

**Version 1.0 — June 2026**

## PREREQUISITES
- Access to Google Cloud Console
- Access to Supabase Dashboard
- Access to Vercel Dashboard
- Access to Redis provider console
- Docker image registry credentials
- DNS management access

---

## RUNBOOK 1: DATABASE FAILOVER

### Step 1: Assess
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check Supabase status
curl https://status.supabase.com/api/v2/status.json
```

### Step 2: Restore from Backup
```bash
# 1. Download latest backup from Supabase
supabase db dump --data-only --file backup.sql

# 2. Create new database
createdb lumina_recovery

# 3. Restore
psql $RECOVERY_DB_URL < backup.sql

# 4. Verify
psql $RECOVERY_DB_URL -c "SELECT COUNT(*) FROM leads;"
```

### Step 3: Update Configuration
```bash
# Update DATABASE_URL in environment
export DATABASE_URL=$RECOVERY_DB_URL

# Restart API
docker-compose restart api
```

### Step 4: Verify
```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/leads
```

---

## RUNBOOK 2: API BACKEND RECOVERY

### Step 1: Deploy to New Instance
```bash
# Pull latest image
docker pull gcr.io/lumina-overmind/api:latest

# Deploy to Cloud Run
gcloud run deploy lumina-api \
  --image gcr.io/lumina-overmind/api:latest \
  --region asia-southeast1 \
  --set-env-vars DATABASE_URL=$DATABASE_URL
```

### Step 2: Update DNS
```bash
# Point api.lumina-os.com to new instance
gcloud run services update lumina-api --region asia-southeast1
```

### Step 3: Verify
```bash
curl https://api.lumina-os.com/health
```

---

## RUNBOOK 3: REDIS FAILOVER

### Step 1: Provision New Redis
```bash
# Create new Redis instance
redis-cli -h $NEW_REDIS_HOST ping
```

### Step 2: Update Configuration
```bash
export REDIS_URL=$NEW_REDIS_URL
docker-compose restart api celery-worker
```

---

## RUNBOOK 4: FULL SYSTEM RECOVERY

### Step 1: Provision Infrastructure
```bash
# 1. Create new Cloud SQL instance
gcloud sql instances create lumina-recovery --database-version=POSTGRES_15

# 2. Create new Redis
# 3. Deploy API to Cloud Run
# 4. Deploy frontend to Vercel
```

### Step 2: Restore Data
```bash
# Restore database from backup
# Restore file storage from backup
# Rebuild Redis cache (auto-populated)
```

### Step 3: Update DNS
```bash
# Update all DNS records to point to new infrastructure
```

### Step 4: Verify All Systems
```bash
# Health check
curl https://api.lumina-os.com/health

# Frontend
curl https://lumina-os.com

# WebSocket
wscat -c wss://api.lumina-os.com/socket.io
```

---

## POST-RECOVERY

1. Document incident timeline
2. Identify root cause
3. Implement preventive measures
4. Update DR runbook with lessons learned
5. Notify all stakeholders of resolution
6. Schedule post-mortem review

---

© 2024-2026 Lumina Project. All rights reserved.
