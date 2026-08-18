# INSTALLING ON GCP WITH Authorization

```bash
helm install job-service ./infra/job-service-chart \
  -f ./infra/job-service-chart/values-gcp.yaml \
  --set-file workerService.secret.data.key.json=key.json
  ```