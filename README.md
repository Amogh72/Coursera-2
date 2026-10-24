# Cars Dealership — Full-Stack Capstone

A responsive dealership locator and review platform for the Coursera Full-Stack Development Capstone.

## Project name
**Cars Dealership** — dealership locator and review platform.

## Repository structure
This repo follows the course starter layout: Django in `server/djangoapp`, project settings in `server/djangoproj`, React in `server/frontend`, and Node/MongoDB service components in `server/database`.

## Tech stack
- Django / Python and Django authentication
- React and Bootstrap frontend
- Node.js / Express and MongoDB service components
- Docker and Docker Compose
- GitHub Actions CI

## Local setup
Use versions supported by the course. From PowerShell:

```powershell
cd server
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Run the frontend and Node service using the scripts and instructions in `server/frontend` and `server/database`. Configure service URLs through environment variables. Never commit passwords, tokens, or real secrets.

## Evidence for the 28 graded tasks
See [the evidence checklist](evidence/README.md). Server logs, cURL output, screenshots, CI logs, and a deployment URL must come from a real run. They are not fabricated or prefilled in this repository.

- About page: [server/frontend/static/About.html](server/frontend/static/About.html)
- Contact page: [server/frontend/static/Contact.html](server/frontend/static/Contact.html)
- React registration component: [server/frontend/src/components/Register/Register.jsx](server/frontend/src/components/Register/Register.jsx)
- Deployment guidance: [DEPLOYMENT.md](DEPLOYMENT.md)

A public repo is not a deployed application. Deploy it, verify the live URL, and capture the required screenshots after deployment.

See [LICENSE](LICENSE).
