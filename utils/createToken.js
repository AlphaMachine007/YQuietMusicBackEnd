const jwt = require('jsonwebtoken')
// 定义密钥用于加密
const secret = 'thisisyqmusic'
// 创建token
function createToken(info) {
    let token = jwt.sign(info, secret, {
        expiresIn: 60 * 60 *24
    })
    return token
}
// 验证token1
const verifyToken = (req, res, next) => {
    let authorization = req.headers.authorization || req.body.token || req.query.token || '';
    let token = '';
    if (authorization.includes('Bearer')) {
        token = authorization.replace('Bearer', '');
    } else {
        token = authorization
    }
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

// 验证token2
const verify_token = (req, res, callback) => {
    const headers = req.headers;
    if (headers['authorization']) {
        const token = headers['authorization'].split(' ')[1];

        // 认证token
        jwt.verify(token, secret, (err, paylod) => {
            if(err){
                res.status(403);
                res.send({
                    message:`${err.name}: ${err.message} at ${err.expiredAt}`,
                });
                callback({
                    status:403,
                    message:`${err.name}: ${err.message} at ${err.expiredAt}`,
                });
            }
            if (paylod) {
                const { exp, iat, ...sendUser } = paylod;
                callback({ status: 200, data: sendUser });
            }

        })
    }

}

// 创建白名单
const whiteList = ['/login']

module.exports = {
    createToken,
    verifyToken,
    verify_token,
    whiteList,
    secret
}