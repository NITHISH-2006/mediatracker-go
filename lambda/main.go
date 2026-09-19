package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	chiadapter "github.com/awslabs/aws-lambda-go-api-proxy/chi"

	"github.com/yourusername/mediatracker-go/router"
	"github.com/yourusername/mediatracker-go/storage"
)

var chiLambda *chiadapter.ChiLambda

func init() {
	store, err := storage.NewStore()
	if err != nil {
		log.Fatalf("failed to initialize storage: %v", err)
	}
	chiLambda = chiadapter.New(router.New(store))
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return chiLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(handler)
}
