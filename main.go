package main

import (
	"log"
	"net/http"

	"github.com/yourusername/mediatracker-go/config"
	"github.com/yourusername/mediatracker-go/router"
	"github.com/yourusername/mediatracker-go/storage"
)

func main() {
	store, err := storage.NewStore()
	if err != nil {
		log.Fatalf("❌ Failed to initialize storage: %v\n", err)
	}

	r := router.New(store)

	log.Printf("🚀 Server starting on %s\n", config.ServerPort)
	if err := http.ListenAndServe(config.ServerPort, r); err != nil {
		log.Fatalf("❌ Server failed: %v\n", err)
	}
}