{{- define "connection" }}
{{- with .Values.redisService }}    
REDIS_URL: redis://{{ .name }}:{{ .redisPort }}
{{- end }}
{{- with .Values.mongoDBService }}    
MONGO_URL: mongodb://{{ .name }}:{{ .databasePort}}/{{ .dbName }}
{{- end }}
{{- end -}}