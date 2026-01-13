import sqlite3

DB_NAME = "jobs.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        status TEXT NOT NULL,
        applied_date TEXT NOT NULL,
        follow_up_date TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()
