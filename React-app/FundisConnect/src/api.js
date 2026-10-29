import axios from 'axios'

// The one API client for the whole app. 
const client = axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
})

export default client