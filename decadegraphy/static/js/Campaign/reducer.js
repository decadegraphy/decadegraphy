import * as events from 'events.js'

const initialState = {
  roles: {
    photographer: false,
    model: false,
    volunteer: false
  }
}

function reducer(prevState = initialState, { type, payload }) {
  switch(type) {
    case events.SIGNUP_TOGGLE_ROLE: {
      return handle_signup_toogle_role(prevState, payload)
    }
  }
  return {...prevState}
}

function handle_signup_toogle_role(prevState, payload) {
  return {
    ...prevState,
    roles: {
      ...prevState.roles,
      [payload.role]: payload.checked
    }
  }
}

export default reducer
