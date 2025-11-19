import nodemailer from "nodemailer";
export async function POST(req: Request) {
    try {

        const formData = await req.formData();

        const category = formData.get("category");
        const content = formData.get("content");
        const email = formData.get("email");
        const file = formData.get("file");

        console.log("===== 📩 새 POST 요청 도착 =====");
        console.log("카테고리:", category);
        console.log("내용:", content);
        console.log("이메일:", email);
        console.log("파일:", file);

        const transport = nodemailer.createTransport({
            host: "smtp.naver.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let attachments: any[] = [];

        if (file && typeof (file as File).arrayBuffer === "function") {
            const arrayBuffer = await (file as File).arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            attachments.push({
                filename: (file as File).name || `image-${Date.now()}.jpg`,
                content: buffer,
                contentType: (file as File).type || "application/octet-stream",
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `[1:1 문의] ${category}`,
            html: `
                <h2>📩새로운 문의가 도착했습니다</h2>
                <p><strong>카테고리:</strong> ${category}</p>
                <p><strong>내용:</strong><br>${content}</p>
                <p><strong>사용자 이메일:</strong> ${email}</p>
            `,
            attachments,
        };

        await transport.sendMail(mailOptions);

        return Response.json({ message: "이메일 요청 성공" })
    } catch (err: any) {
        return Response.json(
            { message: "서버 에러", error: err.message },
            { status: 500 }
        );
    }
}