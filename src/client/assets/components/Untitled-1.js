await fetch(
  "https://eu-central-1.aws.realm.mongodb.com/api/client/v2.0/auth/profile",
  {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.5",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RldmljZV9pZCI6IjY0NTAxNGE4NTVjMjJkY2MzMmYwMjQ2MSIsImJhYXNfZG9tYWluX2lkIjoiNjQ0NTgwZDU5MmM4YTRkZWYxNjFmYzYzIiwiZXhwIjoxNjgzMDM3MTY1LCJpYXQiOjE2ODMwMzUzNjUsImlzcyI6IjY0NTExNGU1NTVjMjJkY2MzMjRjODkyZSIsInN0aXRjaF9kZXZJZCI6IjY0NTAxNGE4NTVjMjJkY2MzMmYwMjQ2MSIsInN0aXRjaF9kb21haW5JZCI6IjY0NDU4MGQ1OTJjOGE0ZGVmMTYxZmM2MyIsInN1YiI6IjY0NDljYmRmY2Q4MjJjMjU5YTRjOGNlZiIsInR5cCI6ImFjY2VzcyJ9.nUSO6Rh-7p-bS1D9R7Z5-b1-rkOqYFImkfrJ7-xVwIw",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
    },
    referrer: "http://localhost:4000/",
    method: "GET",
    mode: "cors",
  }
);
