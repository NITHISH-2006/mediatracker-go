# Build stage: cross-compile the Lambda handler for linux/amd64
FROM golang:1.26-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bootstrap ./lambda

# Runtime stage: AWS Lambda provided.al2023 image
FROM public.ecr.aws/lambda/provided:al2023
COPY --from=builder /app/bootstrap /var/runtime/bootstrap
CMD ["bootstrap"]