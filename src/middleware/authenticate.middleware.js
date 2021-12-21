import {findById} from '../services/user.service';

const jwt = require('jsonwebtoken');
module.exports.middleware = {
    authenticate: async function(req, res, next) {
        try  {
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.JWT_SECRET);

            try {
                const data = await findById(user.id)
                if (!data) {
                    res.status(401).send({
                        message: 'Authentication failed',
                    })
                }else {
                    req.user = data;
                    next();
                }
            } catch (e) {
                console.log(e)
                res.status(401).send({
                    message: 'Authentication failed',
                    success: false
                })
            }
        } catch (error) {
            res.status(401).json({
                message: 'Authentication failed',
                success: false
            });
        }
    }
}
