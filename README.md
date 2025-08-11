## QuickCourt Dev Notes

Run backend:

```
cd backend
python -m pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

API base: `http://localhost:8000/api`

Run frontend:

```
cd frontend
yarn install
yarn start
```

Set CORS via `CORS_ORIGINS` if needed; Mongo is optional.
