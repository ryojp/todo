FROM alpine:latest

WORKDIR /app/certs

RUN apk update && \
  apk add openssl

CMD openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout domain.key \
  -out signed.crt \
  -subj "/CN=${DOMAIN}" \
  -addext "subjectAltName=DNS:${DOMAIN}" \
  -addext "extendedKeyUsage=serverAuth"
