import jwt from 'jsonwebtoken'

export function authVerifier (req,res, next) {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
    }catch(err) {
        console.log(err)
        return res.status(401).json({error:'Expired or Invalid Token'})
    }
}