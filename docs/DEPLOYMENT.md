# Tuneator Enterprise Deployment Guide

## Prerequisites
- Docker
- Kubernetes cluster (GKE, EKS, AKS, or local)
- Supabase project (for database)
- Stripe account (for billing)

## Environment Variables
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` for each shard
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` for SSO
- `STRIPE_SECRET_KEY` for billing
- `JWT_SECRET` for API auth
- `SNYK_TOKEN` for security scanning

## Docker
```
docker build -t tuneator-app .
docker run -p 3000:3000 --env-file .env tuneator-app
```

## Kubernetes
1. Edit `k8s-deployment.yaml` to set your Docker image and environment variables.
2. Deploy:
```
kubectl apply -f k8s-deployment.yaml
```

## NGINX Load Balancer
- Use `nginx.conf` as a template for your ingress/load balancer.

## Monitoring & Metrics
- Prometheus scrapes `/metrics` on port 9100
- Logs are written to `./logs/app.log` 