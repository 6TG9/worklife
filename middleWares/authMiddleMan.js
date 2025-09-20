const jwt = require("jsonwebtoken");
const JWT_SECRETKEY = "my_life";

const authMiddleman = (req, res, next) => {
  // Extract the authorization header from the incoming request
  const authHeader = req.headers.authorization;

  //   if the header is missing or ddoes not start with "Bearer", reject the request
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Pass a 401 Unauthorized error to the next middleware
    return res.status(401).json({ message: "No token provided" });
  }

  //    split the header into ["Bearer", "token"]
  const token = authHeader.split(" ")[1];

  try {
    // verify the token using the secret key; throw an error message if invalied or expired
    const payload = jwt.verify(token, process.env.JWT_SECRETKEY);

    // Attach the decoded userID to req.user
    req.user = { userId: payload.userId };

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleman;

// {
// Authorization: Bearer token
// }
