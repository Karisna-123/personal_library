import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // Gunakan await
  cookieStore.delete("token");
  
  return NextResponse.json({ message: "Logout berhasil" });
}