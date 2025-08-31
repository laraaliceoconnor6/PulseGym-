//MY helper funcions for unit testing
function formatMemberName(firstName, lastName) {
    if (!firstName || !lastName) return null;
    return `${firstName} ${lastName}`;
}

function isValidMembership(type) {
    const valid = ['Basic', 'Premium', 'VIP'];
    return valid.includes(type);
}

function maxMembersExceeded(current, max) {
    return current >= max;
}

module.exports = { formatMemberName, isValidMembership, maxMembersExceeded };
