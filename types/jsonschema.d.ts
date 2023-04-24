declare namespace JSONSchema {

  /**
   * Describe the response of the API operation.
   * 
   * @see {@link https://swagger.io/docs/specification/describing-responses/ Swagger Describing Responses}
   */
  type Response = {
    [code: number]: {
      type: import("json-schema").JSONSchema7TypeName;
      description?: string;
      properties?: Record<string, import("json-schema").JSONSchema7Definition>;
    };
  };

}