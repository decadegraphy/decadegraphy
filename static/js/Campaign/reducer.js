import * as events from 'events.js'

const initialState = {
  roles: {
    photographer: false,
    model: false,
    volunteer: false
  },
  stepIndex: 0,
  twitterId: null
}

function reducer (prevState = initialState, { type, payload }) {
  switch (type) {
    case events.SIGNUP_TOGGLE_ROLE: {
      return handleSignupToggleRole(prevState, payload)
    }
    case events.CHANGE_STEP: {
      return handleChangeStep(prevState, payload)
    }
    case events.TWITTER_ID_FETCHED: {
      return handleTwitterIdFetched(prevState, payload)
    }
    case events.SIGNUP_ROLES_FETCHED: {
      return handleSignupRolesFetched(prevState, payload)
    }
  }
  return {...prevState}
}

function handleSignupToggleRole (prevState, payload) {
  return {
    ...prevState,
    roles: {
      ...prevState.roles,
      [payload.role]: payload.checked
    }
  }
}

function handleChangeStep (prevState, { stepIndex }) {
  return {
    ...prevState,
    stepIndex: stepIndex
  }
}

function handleTwitterIdFetched (prevState, { twitterId }) {
  return {
    ...prevState,
    twitterId
  }
}

function handleSignupRolesFetched (prevState, { roles }) {
  return {
    ...prevState,
    roles
  }
}

export default reducer
