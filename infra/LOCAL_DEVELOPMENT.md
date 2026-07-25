# Minikube

minikube addons enable ingress

kubectl apply -f k8s/

kubectl patch svc ingress-nginx-controller \
 -n ingress-nginx \
 -p '{"spec":{"type":"LoadBalancer"}}'

sudo minikube tunnel

# /etc/hosts entry

127.0.0.1 job-service.test
