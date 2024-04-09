import { Headers } from "./headers";
import axios from 'axios'

//const API_URL = `${process.env.REACT_APP_API_URL}`;
const API_URL = 'https://white-cloud.vercel.app';

export default function call({ path, method, data }) {
  console.log("API_URL: ", API_URL);
  return new Promise((resolve, reject) => {
    axios({
      url: `${API_URL}${path}`,
      method,
      data,
      headers: Headers(),
    })
    .then((d) => {
      resolve(d.data);
    })
    .catch((err) => {
        let status = err?.response?.data?.status;
        if (status === 403 || status === 401 || status === 404) 
        {
          let e = err?.response?.data;
          if (!e) return;
          reject(e);
        }
      });
  });
}
