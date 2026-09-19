# Testing — Ship-Gate Checklist

Use this to prove the app works end-to-end on the deployed URL.

## Ship Gate (must all pass)

```
https://<app>.amplifyapp.com
```

| Step | Test | Pass? |
|------|------|-------|
| 1 | Homepage **loads** (no login wall) | ☐ |
| 2 | **Register** a new account | ☐ |
| 3 | **Login** with the new account | ☐ |
| 4 | **Add media** (search or manual add) | ☐ |
| 5 | **Add to library** with a status | ☐ |
| 6 | Library **saves** and reloads (DynamoDB persistence) | ☐ |
| 7 | **Dashboard** renders stats + Media Profile + completion rate | ☐ |
| 8 | **Recommendations** return titles with "why" reason | ☐ |
| 9 | Logout works | ☐ |
| 10 | Reload page after login — session persists (JWT in localStorage) | ☐ |

## Additional Checks

- Mobile browser (DevTools responsive mode): layout usable at 375px ✅/☐
- CORS ok: app on Amplify domain can call API without console errors ✅/☐
- API health: `curl https://<api-url>/health` → `{"status":"ok"}` ✅/☐
- Data survives Lambda cold start (wait 5 min, reload library) ✅/☐
- Security: `ALLOWED_ORIGINS` = Amplify domain in prod (not `*`) ✅/☐

## Loaded Test Data (for demo)

For a good demo, register and add ~8–10 titles across anime/movies/games with
mixed statuses so the dashboard and recommendations look alive.

## Bugs Found

| Date | Bug | Fixed? |
|------|-----|--------|
| | | |