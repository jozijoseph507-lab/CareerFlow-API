# CareerFlow

CareerFlow is a simple backend API to help you **track job applications, manage follow-ups, and stay organized during your job search**, built with **Python**, **FastAPI**, and **SQLite**.

---

## **Features**

- Add, update, and delete job applications  
- Automatic follow-up date calculation (7 days after application by default)  
- Track application status (e.g., applied, interviewed, rejected)  
- RESTful API endpoints for easy integration with any frontend  
- Lightweight SQLite database for local storage  

---

## **Tech Stack**

- **Python 3.12+**  
- **FastAPI** for API framework  
- **SQLite** for database  
- **Uvicorn** for running the server  

---

## **Installation**

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/careerflow.git
cd careerflow
Create a virtual environment:

bash
Copy code
python3 -m venv venv
source venv/bin/activate    # Linux/Mac
venv\Scripts\activate       # Windows
Install dependencies:

bash
Copy code
pip install fastapi uvicorn
Running CareerFlow
bash
Copy code
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
Open http://127.0.0.1:8000/docs to see interactive API documentation.

Endpoints:

POST /applications → Add a new application

GET /applications → List all applications

PUT /applications/{id}/status → Update application status

DELETE /applications/{id} → Delete an application

Example Request
json
Copy code
POST /applications
{
  "company": "Google",
  "position": "Software Engineer",
  "applied_date": "2026-01-13"
}
Response:

json
Copy code
{
  "message": "Application added",
  "follow_up_date": "2026-01-20"
}
License
This project is open-source and available under the MIT License.

Author
Jozi Joseph

GitHub: jozijoseph507-lab
