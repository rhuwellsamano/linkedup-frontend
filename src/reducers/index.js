// initial state
const initialState = {
  current_user: {},
  chatLogs: [],
  visible: false
}

// the Dispatcher who gets alert text messages from us and sends/returns the applicable specialized  fireteam to handle them
// state is the store above (initialState) and action is the actions payload it's expecting (an object, an array, etc)
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_USER":
      return {...state, current_user: action.payload}
    case "UPDATE_USER":
      return {...state, current_user: action.payload}
    case "LOGOUT_USER":
      return {...state, current_user: {}}
    case "LOAD_CHATLOGS":
      return {...state, chatLogs: action.payload}
    case "ADD_CHATLOG":
      console.log('reducer says:', action.payload)
      return {...state, chatLogs: action.payload}
    case "TOGGLE_VISIBLE":
      return {...state, visible: !state.visible}
    default:
      return state;
  }
}


// const action = {
//   type: "THIS_STUFFF",
//   payload: {}
// }
