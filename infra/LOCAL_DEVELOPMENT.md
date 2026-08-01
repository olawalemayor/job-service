# Minikube

minikube addons enable ingress

kubectl apply -k k8s/overlays/local

kubectl patch svc ingress-nginx-controller \
 -n ingress-nginx \
 -p '{"spec":{"type":"LoadBalancer"}}'

sudo minikube tunnel

# /etc/hosts entry

127.0.0.1 job-service.test

# Storage

The `local` overlay runs the worker with STORAGE_PROVIDER=local — images are
written to a PVC-backed directory in the pod, no S3/GCS/Azure credentials
needed. See infra/k8s/overlays/ for the aws and gke overlays used for their
respective cloud storage backends.
