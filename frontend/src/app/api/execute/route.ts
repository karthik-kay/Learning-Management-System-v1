import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      stdout: `Mock run successful 🚀\n\nCode received:\n${body.code}`,
      stderr: null,
      compile_output: null,
      status: {
        id: 3,
        description: "Mocked",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to run code" }, { status: 500 });
  }
}
