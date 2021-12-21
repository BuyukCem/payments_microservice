import axios from "axios";

const jwt = require('jsonwebtoken');

export default {
    findById: async (email) => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: process.env.USER_API_URL + "/user/",
                data: {
                    email: email
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) =>{
                resolve(response.data)
            }).catch((error)=>{
                reject('User not found')
            })
        })
    }
}
