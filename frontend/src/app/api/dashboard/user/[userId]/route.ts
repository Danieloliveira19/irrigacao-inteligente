import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  const apiUrl = process.env.API_URL || "http://127.0.0.1:8000";
  const url = `${apiUrl}/dashboard/user/${params.userId}`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Proxy failed", message: err?.message ?? String(err), url },
      { status: 502 }
    );
  }
}
