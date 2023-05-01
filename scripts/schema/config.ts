export const config = {

  /**
   * Absolute directory paths and globs
   */
  dir: {
    json: `${process.cwd()}/src/resources/**/schemas/**/`,
    typescript: `${process.cwd()}/src/types/`,
  },

  /**
   * Filenames and globs
   */
  filename: {
    json: "schema.json",
    typescript: "schemas.d.ts",
    parameters: "{headers,params,querystring,body,response.*}.schema.json",
  },

};