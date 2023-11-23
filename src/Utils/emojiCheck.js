export default function emojiCheck(text) {
    let smile = ' :) '
    let editedText = text.replace(smile, ' \u{1F600} ')
    return editedText
}