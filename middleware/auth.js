import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const isCustomAuth = token.length < 500;
        
        let decodedData;
        if (token && isCustomAuth) {
            console.log("not google");

            decodedData = jwt.verify(token , 'test')
            req.UserId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            const what = req.UserId = decodedData?.sub;
            req.UserId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log("error in minddle ware")
        console.log(error);
    }

}

export default auth;