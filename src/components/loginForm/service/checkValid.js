const symbols = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/**
 * Check valid of mail
 * @param {String} userMail user mail
 * @returns true or undefined
 */
function checkEmail(userMail) {
    if (symbols.test(userMail)) { return true }
}

/**
 * Checks if a field is entered
 * @param {String} userMail user mail
 * @param {String} userLogin user login (if type = signup)
 * @param {String} userName user name (if type = signup)
 * @param {String} userPassword user password
 * @param {String} type type of exam
 * @return {*} return object error
 */

function isIntroduce({ userMail, userLogin, userName, userPassword }, type) {
    if (type === 'signup') {
        if (!userMail) return { text: 'Упс, похоже вы не ввели свою почту!', mail: 'error' }
        if (!userLogin) return { text: 'Упс, похоже вы не ввели свой логин!', login: 'error' }
        if (!userName) return { text: 'Упс, похоже мы не знаем, как вас зовут!', name: 'error' }
        if (!userPassword) return { text: 'Упс, похоже вы не ввели свой пароль!', password: 'error' }
    }

    if (type === 'signin') {
        if (!userMail) return { text: 'Упс, похоже вы не ввели свою почту!', mail: 'error' }
        if (!userPassword) return { text: 'Упс, похоже вы не ввели свой пароль!', password: 'error' }
    }
}

export { isIntroduce, checkEmail }