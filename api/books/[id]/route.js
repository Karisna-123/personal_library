import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

// 1. Ambil data buku untuk Edit (GET)
export async function GET(req, { params }) {
  const userId = await getUserIdFromToken();
  const { id } = await params;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id), userId: userId },
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// 2. Simpan perubahan buku (PUT)
export async function PUT(req, { params }) {
  const userId = await getUserIdFromToken();
  const { id } = await params;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id), userId: userId },
      data: {
        judul: body.judul,
        penulis: body.penulis,
        statusBaca: body.statusBaca,
      },
    });
    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// 3. Hapus buku (DELETE) <-- PASTIKAN BAGIAN INI ADA
export async function DELETE(req, { params }) {
  const userId = await getUserIdFromToken();
  const { id } = await params; // Unwrapping params

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.book.delete({
      where: { 
        id: parseInt(id), 
        userId: userId 
      },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Gagal menghapus buku" }, { status: 500 });
  }
}