import neo4j from 'neo4j-driver'

/**
 * A singleton instance of the Neo4j Driver to be used across the app
 *
 * @type {neo4j.Driver}
 */
let driver


/**
 * Initiate the Neo4j Driver
 *
 * @param {string} uri   The neo4j URI
 * @param {string} username   The username to connect to Neo4j with
 * @param {string} password   The password for the user
 * @returns {Promise<neo4j.Driver>}
 */
export async function initDriver(uri, username, password) {
  driver = neo4j.driver(
    uri,
    neo4j.auth.basic(
      username,
      password
    )
  )
  return driver
}

export function getDriver() {
  return driver
}

export async function closeDriver() {
  if (driver) {
    await driver.close()
  }
}
