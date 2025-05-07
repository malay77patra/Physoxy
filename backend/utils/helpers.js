
function getRandomAvatar() {
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.random().toString(36).substring(7)}`;

}

module.exports = {
    getRandomAvatar,
};