# Deployment checklist

The code is prepared for local development, but **no cloud deployment has been created by this repository workflow**. You must deploy the services in an account you control before recording a live URL or taking deployment screenshots.

## Services to deploy
1. **MongoDB** — managed MongoDB or a persistent database service.
2. **Node API** — build from `server/database/Dockerfile`; set `MONGO_URL` to the database connection string and `PORT` to the platform-provided port.
3. **Sentiment API** — build from `server/djangoapp/microservices/Dockerfile`; it listens on port 5050 by default.
4. **Django** — build from the `server` directory and install `requirements.txt`. Run migrations and collect static assets before starting Gunicorn, for example `python manage.py migrate`, `python manage.py collectstatic --noinput`, then `gunicorn djangoproj.wsgi:application --bind 0.0.0.0:$PORT`.
5. **React frontend** — build from `server/frontend` with `npm ci && npm run build`, then serve the generated build using your chosen static hosting or web server.

## Required configuration
Configure platform environment variables rather than committing credentials:
- Django: `DJANGO_SECRET_KEY` (unique strong value), `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, and `DJANGO_CSRF_TRUSTED_ORIGINS` as appropriate.
- Django service clients: `backend_url` and `sentiment_analyzer_url` pointing to the deployed Node and sentiment services.
- Cross-origin frontend (only if hosted on a different origin): `CORS_ALLOWED_ORIGINS` set to the exact React origin, `DJANGO_CSRF_TRUSTED_ORIGINS` set to trusted HTTPS origins, and session cookies served over HTTPS. Credentialed CORS is enabled, but only configured origins are allowed.
- Homepage link: `FRONTEND_URL` pointing to the deployed React site.
- React build: `REACT_APP_DJANGO_SITE_URL` pointing to the Django website and `REACT_APP_API_BASE` pointing to the Django API base, e.g. `https://your-django-host.example/djangoapp`. The default `/djangoapp` works when frontend and backend share an origin. Do not assume the local CRA proxy works in production.
- Node: `MONGO_URL` and `PORT`.

The local `server/djangoapp/.env` contains non-secret localhost defaults for development. Replace those values through platform configuration for deployment. Do not use the development secret key in production.

## Verification before submitting
1. Confirm the Node API root returns a healthy response.
2. Confirm the sentiment API responds to `/analyze/Fantastic%20services`.
3. Run `python manage.py check` and `python manage.py migrate`.
4. Run `python manage.py shell -c "from djangoapp.populate import initiate; print(initiate())"`.
5. Test registration, login/logout, dealer list, state filtering, dealer details, sentiment labels, and review posting in the browser.
6. Check the GitHub Actions workflow until every job is green.
7. Record the actual deployed URL in `evidence/deploymentURL.txt`.
8. Capture genuine screenshots for tasks 25–28 on the deployed URL and save them under the exact filenames in [the evidence checklist](evidence/README.md).

A public GitHub repository, a passing CI workflow, and a live deployment are three different things. Do not submit a placeholder URL or fabricate screenshots/logs.
