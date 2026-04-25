import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function POST(req) {
  const userId = await getUserIdFromToken();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Petakan data dari frontend ke nama kolom di Prisma
    const newBook = await prisma.book.create({
      data: {
        judul: body.title || body.judul,           // dari frontend 'title' -> ke DB 'judul'
        penulis: body.author || body.penulis,      // dari frontend 'author' -> ke DB 'penulis'
        statusBaca: body.status || "Belum Dibaca", // default value jika statusBaca kosong
        userId: userId
      }
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan ke database" }, { status: 500 });
  }
}

export async function GET() {
  const userId = await getUserIdFromToken();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const books = await prisma.book.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(books);
}