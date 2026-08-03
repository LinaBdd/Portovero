from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Base de données
    DATABASE_URL: str = "sqlite:///./app.db"
    
    # JWT
    SECRET_KEY: str = "votre-clé-secrète-très-sécurisée-changez-moi"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Application
    APP_NAME: str = "FastAPI Application"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()