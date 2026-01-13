from fastapi import FastAPI, HTTPException
from datetime import datetime, timedelta
from database import get_connection, create_tables
from models import ApplicationCreate

app = FastAPI()
create_tables()

def calculate_follow_up(applied_date: str) -> str:
    date = datetime.strptime(applied_date, "%Y-%m-%d")
    follow_up = date + timedelta(days=7)
    return follow_up.strftime("%Y-%m-%d")

@app.get("/")
def root():
    return {"status": "Job Follow-Up API running"}

@app.post("/applications")
def add_application(app_data: ApplicationCreate):
    follow_up_date = calculate_follow_up(app_data.applied_date)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO applications (company, position, status, applied_date, follow_up_date)
        VALUES (?, ?, ?, ?, ?)
    """, (app_data.company, app_data.position, "applied", app_data.applied_date, follow_up_date))
    conn.commit()
    conn.close()
    return {"message": "Application added", "follow_up_date": follow_up_date}

@app.get("/applications")
def get_applications():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.put("/applications/{app_id}/status")
def update_status(app_id: int, status: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE applications SET status = ? WHERE id = ?", (status, app_id))
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    conn.commit()
    conn.close()
    return {"message": "Status updated"}

@app.delete("/applications/{app_id}")
def delete_application(app_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM applications WHERE id = ?", (app_id,))
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    conn.commit()
    conn.close()
    return {"message": "Application deleted"}
