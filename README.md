# 🚀 Job Service — Microservices Backend System

A microservices-based backend system for managing job workflows, featuring asynchronous processing, background workers, and S3-compatible storage integration.

---

## 🧠 Overview

This project demonstrates how to build a scalable backend system using:

- Microservices architecture
- Background job processing (worker pattern)
- Redis-based messaging
- MongoDB for persistence
- S3-compatible storage (via custom endpoint)
- Docker Compose for local orchestration

---

## 🏗️ Architecture

```text
Client → API → Redis Queue → Worker → MongoDB
                               → S3 Storage
```

---

## 🔄 Request Flow

1. Client sends request to API
2. API validates and queues task (Redis)
3. Worker processes task asynchronously
4. Data is stored in MongoDB and/or S3-compatible storage

---

## ⚙️ Services

### **API (`/apps/api`)**

- Handles HTTP requests
- Publishes jobs to Redis
- Interacts with storage services

---

### **Worker (`/apps/worker`)**

- Processes background jobs
- Consumes Redis queue
- Handles storage operations

---

### **Redis**

- Message broker / queue

---

### **MongoDB**

- Primary database

---

### **S3-Compatible Storage**

- Uses custom endpoint (`S3_ENDPOINT`)
- Supports local development via tools like Ministack or LocalStack

---

## 📂 Project Structure

```text
/apps
  ├── api
  ├── worker
/packages
  ├── shared
/infra
  ├── docker-compose.yml
```

---

## 🐳 Running with Docker

```bash
cd infra
docker compose up
```

---

## ⚙️ Environment Variables

```env
PORT=6500
REDIS_URL=redis://redis:6379
MONGO_URL=mongodb://db:27017/job-service

S3_ENDPOINT=http://localhost:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

---

## ⚙️ Engineering Highlights

- Queue-based async processing (Redis)
- Worker pattern for background jobs
- S3-compatible storage abstraction
- Multi-service orchestration using Docker

---

## 🎯 What This Project Demonstrates

- Microservices architecture
- Background job processing
- Integration with external storage systems
- Practical containerized development setup

---

## 👨‍💻 Author

**Olawale Olufisoye**
Backend / Systems Engineer

- 🌐 https://olawalemayor.com
- 💻 https://github.com/olawalemayor

---

## ⭐ Notes

This project reflects practical experience in building distributed backend systems and integrating infrastructure components such as queues and object storage, forming a foundation for platform engineering.
