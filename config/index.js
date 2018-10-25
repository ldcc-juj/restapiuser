const development = require('./env/development');
const ec2 = require('./env/ec2');
const path = require('path');

const defaults = {
    root: path.join(__dirname, '..')
};

module.exports = {
    development: Object.assign({}, development, defaults),
    ec2: Object.assign({}, ec2, defaults),
}[process.env.NODE_ENV || 'development']