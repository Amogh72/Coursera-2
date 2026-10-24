# Deployment notes

The assignment references deployment with IBM Cloud Code Engine. This repository does not contain a real deployment URL until you deploy it from your own account.

Before deployment:
1. Confirm the Django project starts locally and all required endpoints work.
2. Keep secrets in platform environment-variable/secret settings, never in Git.
3. Set production debug, secret-key, and allowed-host settings according to the course.
4. Configure Django, Node/MongoDB, and sentiment service URLs to match the services actually deployed.
5. Run the GitHub Actions workflow and resolve failures.
6. Test registration, login/logout, dealer filtering, dealer details, review posting, and sentiment analysis on the deployed URL.
7. Save the actual URL in your evidence and capture tasks 25–28 from the deployed site.

A successful CI run is not a deployment. A public GitHub repository is not a deployment. Do not write a placeholder URL as if it were live.
