/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
*/

export const publicRoutes = [
    "/",
    "/about",
    "/contacts",
    "/pricing",
    "/privacy",
    "/terms",~
    "/why-pos-kitchen"
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const employeeRoutes = [
    "/menu/",
    "/products/",
    "/orders/",
    "/settings",
];

/**
* An array of routes that are used for authentication
* These routes will redirect logged in users to /settings
* @type {string[]}
*/
export const ownerRoutes = [
    "/api",
    "/settings",
    "/dashboard",
    "/menu/",
    "/products/",
    "/orders/",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";