package main

import (
	"context"

	lambda "github.com/aws/aws-lambda-go/lambda"
	log "github.com/sirupsen/logrus"
)

func main() {
	lambda.Start(handler)
}

func handler(ctx context.Context, event interface{}) error {
	log.SetLevel(log.InfoLevel)
	log.SetFormatter(&log.JSONFormatter{})
	log.WithFields(
		log.Fields{
			"event": event,
		}).Info("Logging out the event")

	return nil
}
