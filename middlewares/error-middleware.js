export function errorMiddleware(error, req, res, next) {
  console.log(error);
  res.status(500).json({
    message: "Something went wrond",
  });
}
