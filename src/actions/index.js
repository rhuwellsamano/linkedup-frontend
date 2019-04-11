// list of all types of Actions and the payloads it sends
// fetch is kind of like an action that activates on "FETCH" and expects to get back data from the server (JSON)
// who want that Action??

import { serverAddress } from '../ServerAddress'

let server = `http://${serverAddress}:3001`

export const addUserToState = userObj => {
  return {
    type: "ADD_USER_TO_STATE",
    payload: userObj
  }
}

export const userPostFetch = user => {
  return dispatch => {
    return fetch(`${server}/api/v1/users`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({user})
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          // Here you should have logic to handle invalid creation of a user.
          // This assumes your Rails API will return a JSON object with a key of
          // 'message' if there is an error with creating the user, i.e. invalid username
        } else {
          localStorage.setItem("token", data.jwt);
          dispatch(loginUser(data.user))
        }
      });
  }
}

const loginUser = userObj => ({
    type: 'LOGIN_USER',
    payload: userObj
})


export const userLoginFetch = user => {
  return dispatch => {
    return fetch(`${server}/api/v1/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({user})
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          // Here you should have logic to handle invalid login credentials.
          // This assumes your Rails API will return a JSON object with a key of
          // 'message' if there is an error
        } else {
          localStorage.setItem("token", data.jwt);
          dispatch(loginUser(data.user))
          dispatch(updateUserStatus(data.user))
        }
      })
  }
}

export const getProfileFetch = () => {
  return dispatch => {
    const token = localStorage.token;
    if (token) {
      return fetch(`${server}/api/v1/profile`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.message) {
            // An error will occur if the JWT token is invalid.
            // If this happens, you may want to remove it.
            localStorage.removeItem("token")
          } else {
            dispatch(loginUser(data.user))
          }
        })
    }
  }
}

export const logoutUser = () => ({
  type: "LOGOUT_USER"
})




export const loadChatLogs = chatLogs => {
  return {
    type: "LOAD_CHATLOGS",
    payload: chatLogs
  }
}

// export const addChatLog = chatLog => {
//   return dispatch => {
//     console.log('chatlog sent:', chatLog)
//     return {
//       type: "ADD_CHATLOG",
//       payload: chatLog
//     }
//   }
// }

export const addChatLog = updatedChatLog => ({
  type: "ADD_CHATLOG",
  payload: updatedChatLog
})

export const chatLogsGetFetch = () => {
  return (dispatch) => {
    return fetch(`${server}/api/v1/chatLogs`)
    .then(res => res.json())
    .then(chatLogs => {
      console.log("chatLogsGetFetch:", chatLogs)
      dispatch(loadChatLogs(chatLogs))
    })
  }
}

export const updateUserStatus = (userObj) => {
  console.log('userObj:', userObj)

  let userStatus = (!userObj.online ? "true" : "false")

  return (dispatch) => {
      return fetch(`${server}/api/v1/users/${userObj.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            online: userStatus
          })
    })

  }
}



















///
