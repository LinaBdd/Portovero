from fastapi import FastAPI
from app.database.session import engine


app = FastAPI(
    title="Portovero API"
)


@app.get("/")
def root():

    return {
        "message": "Portovero API running"
    }


@app.get("/db-test")
def db_test():

    try:
        with engine.connect() as connection:
            return {
                "database": "connected ✅"
            }

    except Exception as e:
        return {
            "error": str(e)
        }