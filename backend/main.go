package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Vicente/Password-Mobile-App/backend/app/controllers"
	"github.com/Vicente/Password-Mobile-App/backend/app/dal"
	"github.com/Vicente/Password-Mobile-App/backend/app/routes"
	"github.com/Vicente/Password-Mobile-App/backend/app/services"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Carregar variáveis de ambiente do arquivo .env
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	// Configurar conexão com o banco de dados
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "host=localhost user=postgres password=postgres dbname=password_app port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Falha ao conectar ao banco de dados: %v", err)
	}

	// Migrar os modelos para o banco de dados
	if err := db.AutoMigrate(&types.User{}); err != nil {
		log.Fatalf("Falha ao migrar modelos: %v", err)
	}

	// Inicializar DAL
	authDAL := dal.NewAuthDAL(db)

	// Inicializar serviços
	authService := services.NewAuthService(authDAL)

	// Inicializar controladores
	authController := controllers.NewAuthController(authService)

	// Configurar o Gin
	router := gin.Default()

	// Configurar rotas
	routes.SetupAuthRoutes(router, authController)

	// Iniciar o servidor
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Servidor iniciado na porta %s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Falha ao iniciar o servidor: %v", err)
	}
} 