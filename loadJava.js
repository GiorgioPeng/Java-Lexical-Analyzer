/**
 * read upload file
 * @param {Event} event change event
 */
const upload = (event) => {
    const file = event.files[0]
    // if the file which is uploaded is not Java file
    if (file.name.split('.')[file.name.split('.').length - 1] != 'java') {
        alert('Please upload Java file!')
        return;
    }
    const fileReader = new FileReader()
    fileReader.readAsText(file, 'utf-8')
    fileReader.onload = (e) => {
        // @param input is define in the last LA.js file, it is the input textarea HTML element
        input.value = e.target.result;
    }
}