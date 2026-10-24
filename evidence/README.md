# Coursera Capstone — Evidence Checklist

Save genuine output from your own local run. Do not make up cURL output, screenshots, CI success, or a deployment URL. Store text evidence in this folder and screenshots in `screenshots/`; never include passwords, access tokens, or secrets.

| Task | Required evidence | Suggested filename |
|---|---|---|
| 1 | Public README URL with project name | Repository README |
| 2 | Terminal output showing Django server running | `django_server.txt` |
| 3 | Public About.html source URL | `server/frontend/static/About.html` |
| 4 | Public Contact.html source URL | `server/frontend/static/Contact.html` |
| 5 | Login cURL command and real response | `loginuser.txt` |
| 6 | Logout cURL command and real response | `logoutuser.txt` |
| 7 | React registration component URL | `server/frontend/src/components/Register/Register.jsx` |
| 8 | Dealer reviews cURL command and response | `getdealerreviews.txt` |
| 9 | All dealers cURL command and response | `getalldealers.txt` |
| 10 | Dealer-by-ID cURL command and response | `getdealerbyid.txt` |
| 11 | Kansas dealers cURL command and response | `getdealersbyState.txt` |
| 12 | Admin root-user login screenshot | `admin_login.png` |
| 13 | Admin logout screenshot | `admin_logout.png` |
| 14–15 | All car makes/models cURL output | `getallcarmakes.txt` |
| 16 | Sentiment analysis for “Fantastic services” | `analyzereview.txt` |
| 17 | Homepage dealers before login | `get_dealers.png` |
| 18 | Logged-in homepage, username, Review Dealer option, URL bar visible | `get_dealers_loggedin.png` |
| 19 | State-filtered dealers, URL bar visible | `dealersbystate.png` |
| 20 | Dealer details and reviews, URL bar visible | `dealer_id_reviews.png` |
| 21 | Review form filled, before submission | `dealership_review_submission.png` |
| 22 | Successfully posted review visible | `added_review.png` |
| 23 | Successful GitHub Actions workflow logs | `CICD.txt` |
| 24 | Actual deployed application URL | `deploymentURL.txt` |
| 25 | Deployed landing page | `deployed_landingpage.png` |
| 26 | Deployed logged-in page with username visible | `deployed_loggedin.png` |
| 27 | Deployed dealer detail page | `deployed_dealer_detail.png` |
| 28 | Review visible on deployed app | `deployed_add_review.png` |

## Capturing real terminal evidence
Use the endpoint and port configured in your actual project. Example format (adjust URL and credentials; do not commit real passwords):

```bash
curl -i http://127.0.0.1:8000/
```

For JSON POST requests, use the API's actual field names and content type. Verify each endpoint first, then save the exact command and response. For session-authenticated endpoints, preserve cookies with `-c cookies.txt` and `-b cookies.txt` as needed; keep cookie files out of Git.

## Screenshot quality
Capture the real browser window with the requested URL visible where required. Use a test account, avoid showing passwords or unrelated personal information, and save screenshots with the exact requested names. The grader may reject screenshots that do not clearly show the requested state.