import { User } from "../../../DB/Models/index.js";

export const isAuthQl = async (token) => {
  try {
    if (!token) {
      return new Error("please login first", { cause: 400 });
    }
    if (!token.startsWith(process.env.TOKEN_PREFIX)) {
      return new Error("invalid token ", { cause: 400 });
    }

    const originalToken = token.split(" ")[1];
    const data = jwt.verify(originalToken, process.env.LOGIN_SECRET);

    const isUserExists = await User.findById(data?.userId);
    if (!isUserExists) return new Error("please signup", { cause: 400 });

    return {
      code: 200,
      isUserExists,
    };
  } catch (error) {
    console.log(error);
    return new Error("catch error in auth", { cause: 500 });
  }
};
