export default function filterMessage(message) {
    let filteredMessage = ''
    if (message.includes('detail')) {
        return 'Invalid login credentials.'
    }
    if (message.includes('username')) {
        filteredMessage += 'Username '
    }
    if (message.includes('password')) {
        filteredMessage += 'Password '
    }
    return filteredMessage + 'cannot be empty.'
}