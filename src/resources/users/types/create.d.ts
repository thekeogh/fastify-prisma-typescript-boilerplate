declare namespace Api {
  namespace Resources {
    namespace Users {
      namespace Create {

        /**
         * Describe the endpoint request body
         */
        type Body = Pick<Api.Resources.Users.User, "email" | "name" >;

        /**
         * Describe the endpoint response body
         */
        type Response = Api.Resources.Users.User;

      }
    }
  }
}