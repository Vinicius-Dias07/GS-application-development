import app from "./app"

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Api rodando em http://localhost:${PORT}`);
});
