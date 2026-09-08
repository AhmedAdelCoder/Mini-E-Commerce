const loggerMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();

    const duration = Number(end - start) / 1_000_000;

    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration.toFixed(2)}ms)`
    );
  });

  next();
};

export default loggerMiddleware;