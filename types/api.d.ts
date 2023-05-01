/**
 * Defines global types used by the service.
 *
 * @remarks
 * It is recommended to define all types in their respective resource folder,
 * such as "src/users/", unless they are global types that do not fit
 * naturally in any other area or are used throughout the entire service.
 * In such cases, they should be included in this definition.
 */

declare namespace Api {
  
  /**
  * Represents the possible values for the NODE_ENV environment variable in a Node.js application.
  * 
  * @see {@link https://nodejs.org/api/process.html#process_process_env | process.env}
  */
  type Environment = "development" | "staging" | "production" | "test" | "ci";

}
