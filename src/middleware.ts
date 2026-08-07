import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return new NextResponse(
    `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex,nofollow">
<title>LaunchLens Maintenance</title>
<style>
body{
  margin:0;
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:#0b0b0b;
  color:#fff;
  font-family:system-ui,sans-serif;
}
.container{
  text-align:center;
  max-width:600px;
  padding:24px;
}
h1{
  font-size:3rem;
  margin-bottom:12px;
}
p{
  color:#b3b3b3;
  font-size:1.1rem;
}
</style>
</head>
<body>
<div class="container">
<h1>LaunchLens</h1>
<p>Temporarily offline for scheduled security improvements.</p>
</div>
</body>
</html>
`,
    {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "86400",
      },
    }
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};