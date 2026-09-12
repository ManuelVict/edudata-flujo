# =======================================================
# Edudata Flujo - Dockerfile de Producción
# Servidor web ligero de alto rendimiento con Nginx Alpine
# =======================================================
FROM nginx:1.27-alpine

LABEL maintainer="EduData - Observatorio de la Educación"
LABEL description="Visualizador de Flujo Operativo y Seguimiento de Actividades"

# Instalar wget/curl para healthchecks si se requiere
RUN apk add --no-cache curl

# Copiar configuración optimizada de Nginx con proxy reverso a Google Sheets
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los artefactos estáticos de la aplicación
COPY dist/ /usr/share/nginx/html/

# Exponer el puerto estándar HTTP
EXPOSE 80

# Comprobación de salud del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
