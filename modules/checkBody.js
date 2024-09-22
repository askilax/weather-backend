function checkBody(body, requiredFields) {
    for (let items of requiredFields) {
        if (!body[items] || (typeof body[items] === 'string' && body[items].trim() === '')) {
            return false;
        }
    }
    return true;
}

module.exports = { checkBody };