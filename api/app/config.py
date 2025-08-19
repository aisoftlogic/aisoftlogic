# api/app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # Server
    uvicorn_host: str = Field(default="0.0.0.0", alias="UVICORN_HOST")
    uvicorn_port: int = Field(default=8000, alias="UVICORN_PORT")

    # Postgres
    pg_host: str = Field(default="db", alias="PGHOST")
    pg_port: int = Field(default=5432, alias="PGPORT")
    pg_user: str = Field(default="postgres", alias="PGUSER")
    pg_password: str = Field(default="postgres", alias="PGPASSWORD")
    pg_database: str = Field(default="appdb", alias="PGDATABASE")

    # Redis
    redis_url: str = Field(default="redis://redis:6379/0", alias="REDIS_URL")

    # MinIO / S3
    s3_endpoint: str = Field(default="http://minio:9000", alias="S3_ENDPOINT")
    s3_access_key: str = Field(default="minioadmin", alias="S3_ACCESS_KEY")
    s3_secret_key: str = Field(default="minioadmin", alias="S3_SECRET_KEY")
    s3_bucket: str = Field(default="aisoftlogic", alias="S3_BUCKET")

    # Keycloak
    keycloak_url: str = Field(default="http://keycloak:8081", alias="KEYCLOAK_URL")

    # Pydantic Settings config (v2)
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()