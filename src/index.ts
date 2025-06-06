import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors"

async function init() {
    try {
        const result = await db();

        console.log("database status", result);

        const app = express();
        const PORT = 3000;

        app.get("/", (req, res) => {
            res.status(200).json({
                message: "Server is Running",
                data: null
            })
        })

        app.use(cors())
        // ✅ Pasang body-parser DULU
        app.use(bodyParser.json());

        // ✅ Baru pasang router
        app.use("/api", router);
        docs(app)

        app.listen(PORT, () => {
          console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
init();

