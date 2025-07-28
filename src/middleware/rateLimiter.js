import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const clientIp = req.ip;
    const { success } = await ratelimit.limit(clientIp);

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next(error);
  }
};

export default ratelimiter;
