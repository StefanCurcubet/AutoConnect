export default function verifySignUp(data) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let dataCorrect = true
    let issues = ''
    if (data.username === '') {
        issues += '\n- username cannot be empty'
        dataCorrect = false
    }
    if (data.password === '') {
        issues += '\n- password cannot be empty'
        dataCorrect = false
    }
    if (!emailPattern.test(data.email)) {
        issues +='\n- email format incorrect'
        dataCorrect = false
    }
    if (issues !== '') {
        alert(issues)
    }
    return dataCorrect
}