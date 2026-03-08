import { NextRequest, NextResponse } from "next/server"
import pdfParse from "pdf-parse"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDF 파일만 업로드 가능합니다." }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const data = await pdfParse(buffer)

    console.log("[parse-pdf] 파싱 완료")
    console.log("[parse-pdf] 파일명:", file.name)
    console.log("[parse-pdf] 페이지 수:", data.numpages)
    console.log("[parse-pdf] 추출된 텍스트:\n---\n", data.text, "\n---")

    return NextResponse.json({
      text: data.text,
      pageCount: data.numpages,
      fileName: file.name,
    })
  } catch (err) {
    console.error("[parse-pdf]", err)
    return NextResponse.json({ error: "PDF 파싱에 실패했습니다." }, { status: 500 })
  }
}
