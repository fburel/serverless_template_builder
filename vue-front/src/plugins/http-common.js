import axios from "axios";

export default axios.create({
    baseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://ec2-15-188-147-85.eu-west-3.compute.amazonaws.com',
    headers: {
        "Content-type": "application/json"
    }
});
