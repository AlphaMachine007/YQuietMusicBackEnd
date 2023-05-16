const tokenTool = require('./createToken');

const authorization = (req, res, next) => {
    tokenTool.verify_token(req,res,result=>{
        if(result.status == 200){
            next();
        }else{
            res.send({
                state:403,
                message:'jwt expired',
                expiredAt:new Date()
            })
        }
    })
}
module.exports = {
    authorization
}