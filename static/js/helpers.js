class Helpers {
  static getCookie (key) {
    let cookieString = document.cookie
    if (cookieString.length !== 0) {
      let cookiePattern = new RegExp(key + '=([^;]*)'),
        results = cookieString.match(cookiePattern) || []

      results.reverse()
      return results[0] || ''
    }
    return ''
  }

  static post (URL, dataOrForm, callback) {
    let xhr = new XMLHttpRequest(),
      isForm = dataOrForm.tagName === 'FORM',
      data = isForm ? new FormData(dataOrForm) : JSON.stringify(dataOrForm),
      token = Helpers.getCookie('csrftoken')

    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return
      }
      let response = JSON.parse(this.responseText)
      callback(response, xhr)
    }
    xhr.open('POST', URL)
    xhr.setRequestHeader('X-CSRFToken', token)
    if (!isForm) {
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    }
    xhr.send(data)
  }

  static getJSON (URL, callback) {
    let xhr = new XMLHttpRequest(),
      response

    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) {
        return
      } try {
        response = JSON.parse(this.responseText)
      } catch (e) {
        response = null
      } finally {
        callback(response, xhr)
      }
    }
    xhr.open('GET', URL)
    xhr.send()
  }

  static getJSONP (url) {
    let script = document.createElement('script')
    script.setAttribute('src', url)
    document.getElementsByTagName('head')[0].appendChild(script)
  }

  static serializeForm (form) {
    let inputs = form.elements,
      data = {}

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i]
      if (!input.name || data.hasOwnProperty(input.name) || input.disabled) {
        continue
      }
      if (input.name.indexOf('[]') !== -1) {
        let arrayInput = form.elements[input.name],
          values = []

        if (arrayInput.tagName) {
          // HTMLInputElement
          values.push(arrayInput.value)
        } else {
          // RadioNodeList
          for (let ai = 0; ai < arrayInput.length; ai++) {
            if ((arrayInput[ai].type === 'checkbox') && !arrayInput[ai].checked) continue
            if (arrayInput[ai].disabled) {
              continue
            }
            values.push(arrayInput[ai].value)
          }
        }
        data[input.name.replace('[]', '')] = values
      } else {
        data[input.name] = form.elements[input.name].value
      }
    }
    return data
  }

  static translateRoleNames (roles) {
    if (!roles) { roles = [] }

    const roleNames = {
      photographer: '摄影师',
      participant: '模特',
      volunteer: '志愿者'
    }

    return Object.keys(roleNames)
      .filter(role => roles[role])
      .map(role => roleNames[role])
  }
}

export default Helpers
