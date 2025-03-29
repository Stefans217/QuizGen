import request from "supertest";
import express from "express";
import router from "../../../routes/quiz/serveQuizRoute";
import { prismaMock } from '../../../singleton'

jest.mock("../../../client", () => ({
    quizFile: {
        findUnique: jest.fn(),
    },
}));

const app = express();
app.use(express.json());
app.use("/", router);

describe("POST /serve-quiz", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 404 if quiz file not found", async () => {
        (prismaMock.quizFile.findUnique as jest.Mock).mockResolvedValueOnce(null);
        const res = await request(app).post("/serve-quiz").send({ quizId: "nonexistent" });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Quiz file not found");
    });

    it("should return 404 if quiz file exists but has no zipData", async () => {
        (prismaMock.quizFile.findUnique as jest.Mock).mockResolvedValueOnce({ quizId: "quiz1", zipData: null });
        const res = await request(app).post("/serve-quiz").send({ quizId: "quiz1" });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Quiz file not found");
    });

    it("should return 200 and serve the zip file when found", async () => {
        const fakeZip = Buffer.from("fakezipdata");
        (prismaMock.quizFile.findUnique as jest.Mock).mockResolvedValueOnce({ quizId: "quiz1", zipData: fakeZip });
        const res = await request(app).post("/serve-quiz").send({ quizId: "quiz1" });
        expect(res.status).toBe(200);
    });

    it("should return 500 if an error occurs while fetching the quiz file", async () => {
        (prismaMock.quizFile.findUnique as jest.Mock).mockRejectedValueOnce(new Error("database error"));
        const res = await request(app).post("/serve-quiz").send({ quizId: "quiz1" });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal server error");
    });
});
