// This 'require' statement will actually invoke a function here
const routes = require('next-routes')();

// The ':' is indicating that anything after this is a wildcard
routes
    .add("/campaigns/new", "/campaigns/new")
    .add("/campaigns/:address", '/campaigns/show')
    .add('/campaigns/:address/requests', "/campaigns/requests/index")
    .add('/campaigns/:address/requests/new', "/campaigns/requests/new");

module.exports = routes;

