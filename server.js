import app from "./app";
const port = 3000;
app.listen(port, () => {
  console.log();
  console.log(`servidor escutando na porta ${port}`);
  console.log(` http://127.0.1:${port}`);
});
