from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

app = FastAPI() 
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
connection = psycopg2.connect(
    dbname="internship_tracker",
    user="postgres",
    host="localhost",
    port="5432",
    password=os.getenv("DB_PASSWORD"),
)

cursor = connection.cursor(cursor_factory=RealDictCursor)

class Application(BaseModel):
    company: str
    position: str
    status: str 



@app.get("/applications") 
def home(): 
    cursor.execute("SELECT * FROM applications;")
    rows = cursor.fetchall()

    return rows 


@app.get("/applications/{application_id}")
def get_application(application_id: int):
    cursor.execute("SELECT * FROM applications WHERE id = %s;", (application_id,))
    application = cursor.fetchone()

    return application


@app.post("/applications")
def create_application(application: Application):
    cursor.execute("INSERT INTO applications (company, position, status) VALUES (%s, %s, %s) RETURNING *", 
    (application.company, application.position, application.status))
    
    application = cursor.fetchone()
    connection.commit()

    return application 


@app.delete("/applications/{application_id}")
def delete_application(application_id: int):
    cursor.execute("DELETE FROM applications WHERE id = %s RETURNING *;", (application_id,))

    application = cursor.fetchone()
    connection.commit()

    return application




@app.put("/applications/{application_id}")
def update_application(application_id: int, updated_application: Application):
    cursor.execute("UPDATE applications SET company = %s, position = %s, status = %s WHERE id = %s RETURNING *", 
    (updated_application.company, updated_application.position, updated_application.status, application_id))

    application = cursor.fetchone()
    connection.commit() 

    return application
