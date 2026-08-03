from fastapi import FastAPI
from sqlalchemy import text
from app.database.session import engine

app = FastAPI()


@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.scalar()

            return {
                "status": "connected",
                "database": version,
            }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }