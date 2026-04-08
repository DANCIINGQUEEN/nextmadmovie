import { NextResponse } from "next/server";

export function checkAdminSecret(req) {
    const secret = req.headers.get("x-admin-secret");
    if (!process.env.ADMIN_SECRET) {
        return NextResponse.json({ message: "서버 설정 오류: ADMIN_SECRET이 설정되지 않았습니다." }, { status: 500 });
    }
    if (!secret || secret !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ message: "인증 실패" }, { status: 401 });
    }
    return null; // 인증 통과
}
