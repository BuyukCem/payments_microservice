import axios from "axios";

const jwt = require('jsonwebtoken');

export default {
    findById: async (productId) => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: process.env.USER_API_URL + "/product/"+productId,
                auth: {
                    username: process.env.PRODUCT_API_USERNAME,
                    password: process.env.PRODUCT_API_PASSWORD
                }
            }).then((response) =>{
                resolve(response.data)
            }).catch((error)=>{
                reject('User not found')
            })
        })
    }
}
