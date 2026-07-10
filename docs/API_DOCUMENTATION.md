# LUMINA OVERMIND - API DOCUMENTATION

## Overview

LUMINA Overmind API is a FastAPI-based REST API that provides endpoints for lead management, project tracking, campaign management, VR Sentinel, and workflow automation.

**Base URL:** `http://localhost:8000` (development)

**Authentication:** JWT Bearer Token

---

## Authentication

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "user123",
    "username": "admin",
    "role": "ADMIN"
  }
}
```

### Protected Endpoints

All protected endpoints require JWT token in Authorization header:

```http
Authorization: Bearer <access_token>
```

---

## Projects API

### Get All Projects

```http
GET /api/projects
```

**Response:**
```json
{
  "projects": [
    {
      "id": "clxxx",
      "namaProyek": "Grand Serang Residence",
      "tipeProyek": "KOMERSIL",
      "lokasi": "Serang",
      "hargaStart": 500000000,
      "targetMarket": "Investor",
      "leadsCount": 82,
      "hotLeadsCount": 14,
      "conversionRate": 17.1,
      "isActive": true
    }
  ]
}
```

### Create Project

```http
POST /api/projects
```

**Request Body:**
```json
{
  "namaProyek": "New Project",
  "tipeProyek": "KOMERSIL",
  "lokasi": "Jakarta",
  "hargaStart": 750000000,
  "targetMarket": "Investor",
  "tipeInputLokasi": "NAMA_WILAYAH",
  "namaWilayah": "Jakarta Selatan",
  "radiusKm": 5
}
```

### Update Project

```http
PUT /api/projects/{id}
```

### Delete Project

```http
DELETE /api/projects/{id}
```

---

## Leads API

### Get All Leads

```http
GET /api/leads
```

**Query Parameters:**
- `project_id` (optional): Filter by project
- `status` (optional): Filter by status (new, contacted, qualified, closed)
- `score_min` (optional): Minimum score
- `score_max` (optional): Maximum score
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "leads": [
    {
      "id": "clxxx",
      "business_name": "Test Company",
      "contact": "628123456789",
      "phone": "628123456789",
      "email": "test@example.com",
      "website": "https://example.com",
      "industry": "Real Estate",
      "employee_count": 50,
      "revenue_range": "10M-50M",
      "score": 85,
      "status": "qualified",
      "ai_reasoning": "High intent detected",
      "timeline": [],
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1250,
  "limit": 50,
  "offset": 0
}
```

### Create Lead

```http
POST /api/leads
```

**Request Body:**
```json
{
  "project_id": "clxxx",
  "business_name": "Test Company",
  "contact": "628123456789",
  "phone": "628123456789",
  "email": "test@example.com",
  "website": "https://example.com",
  "industry": "Real Estate",
  "employee_count": 50,
  "revenue_range": "10M-50M",
  "message": "Saya ingin beli properti"
}
```

### Update Lead

```http
PUT /api/leads/{id}
```

### Delete Lead

```http
DELETE /api/leads/{id}
```

### Score Lead

```http
POST /api/leads/{id}/score
```

**Response:**
```json
{
  "lead_id": "clxxx",
  "score": 85,
  "reasoning": "High intent detected based on message content",
  "factors": {
    "keywords": 30,
    "contact_info": 20,
    "revenue": 15,
    "industry": 10,
    "employee_count": 10
  }
}
```

---

## Campaigns API

### Get All Campaigns

```http
GET /api/campaigns
```

**Response:**
```json
{
  "campaigns": [
    {
      "id": "clxxx",
      "name": "Facebook Lead Gen - Q1 2024",
      "status": "active",
      "budget": 50000,
      "spent": 32500,
      "leads": 156,
      "conversions": 23,
      "roi": 145,
      "platform": "Facebook",
      "start_date": "2024-01-01",
      "end_date": "2024-03-31"
    }
  ]
}
```

### Create Campaign

```http
POST /api/campaigns
```

**Request Body:**
```json
{
  "name": "New Campaign",
  "project_id": "clxxx",
  "platform": "Facebook",
  "budget": 30000,
  "start_date": "2024-01-01",
  "end_date": "2024-03-31",
  "config": {}
}
```

### Update Campaign

```http
PUT /api/campaigns/{id}
```

### Delete Campaign

```http
DELETE /api/campaigns/{id}
```

---

## VR Sentinel API

### Create VR Session

```http
POST /api/vr/session
```

**Request Body:**
```json
{
  "user_id": "user123",
  "campaign_id": "clxxx",
  "model_path": "/models/property.glb",
  "skybox_image": "/images/skybox.jpg",
  "enable_gaze_tracking": true,
  "enable_time_sync": true
}
```

**Response:**
```json
{
  "session_id": "sess_xxx",
  "status": "created",
  "websocket_url": "ws://localhost:8000/ws/vr/sess_xxx"
}
```

### Log VR Activity

```http
POST /api/vr/activity
```

**Request Body:**
```json
{
  "session_id": "sess_xxx",
  "user_id": "user123",
  "campaign_id": "clxxx",
  "gaze_data": {
    "x": 0.5,
    "y": 0.5,
    "duration": 2.5
  },
  "object_name": "Building A",
  "focus_duration": 3.2,
  "interaction_type": "VIEW",
  "position": { "x": 10, "y": 5, "z": 0 },
  "rotation": { "x": 0, "y": 90, "z": 0 },
  "lead_intent": "HIGH",
  "confidence": 0.85,
  "tags": ["residential", "premium"]
}
```

---

## Workflows API

### Get All Workflows

```http
GET /api/workflows
```

**Response:**
```json
{
  "workflows": [
    {
      "id": "clxxx",
      "name": "Lead Qualification Flow",
      "description": "Automated lead qualification process",
      "status": "active",
      "nodes": [],
      "edges": [],
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Deploy Workflow

```http
POST /api/workflows/deploy
```

**Request Body:**
```json
{
  "name": "New Workflow",
  "description": "Workflow description",
  "nodes": [
    {
      "id": "node1",
      "type": "input",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "Start" }
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "source": "node1",
      "target": "node2"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "workflow_id": "clxxx",
  "message": "Workflow deployed successfully",
  "deployed_at": "2024-01-15T10:00:00Z"
}
```

---

## Analytics API

### Get Overview Metrics

```http
GET /api/analytics/overview
```

**Query Parameters:**
- `period` (optional): 7d, 30d, 90d, 1y (default: 30d)

**Response:**
```json
{
  "total_leads": 1250,
  "hot_leads": 234,
  "conversion_rate": 18.7,
  "avg_score": 72,
  "revenue": 45000000,
  "roi": 145,
  "trends": {
    "leads_growth": 12.5,
    "conversion_growth": 8.3,
    "revenue_growth": 22.1
  }
}
```

### Get Performance by Source

```http
GET /api/analytics/by-source
```

**Response:**
```json
{
  "data": [
    {
      "source": "Facebook",
      "leads": 450,
      "conversion": 22,
      "revenue": 15000000,
      "trend": 15
    }
  ]
}
```

### Get Performance by Region

```http
GET /api/analytics/by-region
```

**Response:**
```json
{
  "data": [
    {
      "region": "Jakarta",
      "leads": 450,
      "hot": 85,
      "avg_score": 78
    }
  ]
}
```

---

## WebSocket API

### Connect to WebSocket

```javascript
const socket = io('http://localhost:8000', {
  auth: {
    token: 'your_jwt_token'
  }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

socket.on('lead_update', (data) => {
  console.log('Lead updated:', data);
});

socket.on('campaign_update', (data) => {
  console.log('Campaign updated:', data);
});
```

### Events

- `lead_update`: Triggered when a lead is created or updated
- `campaign_update`: Triggered when campaign metrics change
- `system_status`: System health status updates
- `vr_activity`: VR Sentinel activity updates

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "detail": "Detailed error message",
  "status_code": 400
}
```

### Common Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

API is rate-limited to prevent abuse:

- **Default:** 100 requests per minute
- **Authenticated:** 200 requests per minute
- **Admin:** 500 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## SDK Examples

### Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Login
response = requests.post(f"{BASE_URL}/api/auth/login", json={
    "username": "admin",
    "password": "password"
})
token = response.json()["access_token"]

# Get projects
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/api/projects", headers=headers)
projects = response.json()["projects"]
```

### JavaScript

```javascript
const BASE_URL = "http://localhost:8000";

// Login
const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "password" })
});
const { access_token } = await loginResponse.json();

// Get projects
const projectsResponse = await fetch(`${BASE_URL}/api/projects`, {
  headers: { "Authorization": `Bearer ${access_token}` }
});
const { projects } = await projectsResponse.json();
```

---

## Support

For API support, contact:
- Email: support@lumina-overmind.com
- Documentation: https://docs.lumina-overmind.com
- GitHub Issues: https://github.com/lumina-overmind/api/issues
