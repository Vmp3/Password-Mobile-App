FROM golang:1.19-alpine AS builder

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/docker.env ./.env

EXPOSE 8080

CMD ["./main"] 