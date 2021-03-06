

const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithEmail = function (email) {
  return pool.query(
    `SELECT *
   FROM users
   WHERE email = $1`, [email])
    .then(res => {
      const users = res.rows;
      if (users.length === 0) {
        return null
      } else {
        return res.rows[0]
      }
    })
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithId = function (id) {
  return pool.query(
    `SELECT *
   FROM users
   WHERE id = $1`, [id])
    .then(res => {
      const users = res.rows;
      if (users.length === 0) {
        return null
      } else {
        return res.rows[0]
      }
    })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
    INSERT INTO users(name, email, password)
    VALUES($1 ,$2, $3)
    RETURNING *;
  `, [user.name, user.email, user.password])
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
 const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(
    `SELECT reservations.*, properties.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON properties.id = reservations.property_id
    JOIN property_reviews ON reservations.id = property_reviews.reservation_id
    WHERE reservations.guest_id = $1
    AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2`, [guest_id, limit])
    .then (res => {
     return res.rows
    })
} 

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    if (queryString.includes('WHERE')) {
      queryString += ` AND `;
    } else {
      queryString += ` WHERE `;
    }

    queryParams.push(Number(options.owner_id));
    queryString += ` owner_id = $${queryParams.length} `
  }

  if (options.minimum_price_per_night) {
    if (queryString.includes('WHERE')) {
      queryString += ` AND `;
    } else {
      queryString += ` WHERE `;
    }

    queryParams.push(Number(options.minimum_price_per_night));
    queryString += ` cost_per_night > $${queryParams.length} `
  }

  if (options.maximum_price_per_night) {
    if (queryString.includes('WHERE')) {
      queryString += ` AND `;
    } else {
      queryString += ` WHERE `;
    }

    queryParams.push(Number(options.maximum_price_per_night));
    queryString += `cost_per_night < $${queryParams.length}`
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `HAVING AVG(rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams)

  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryKeys = Object.keys(property);
  const queryParams = [];
  const queryValues = [];

  for (const key of queryKeys) {
    queryParams.push(property[key]);
    queryValues.push(`$${queryParams.length}`);
  }
  
  let queryString = `
  INSERT INTO properties (${queryKeys.join(', ')}) 
  VALUES (${queryValues.join(', ')})
  RETURNING *;
  `

  console.log(queryString);

  return pool.query(queryString, queryParams)
  .then(res => {
    console.log(res.rows[0])
    return res.rows[0];
  })
  .catch(err => {
    console.log(err);
    return null;
  });
}
exports.addProperty = addProperty;
