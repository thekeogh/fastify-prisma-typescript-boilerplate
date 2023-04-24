declare namespace Api {
  namespace Resources {
    namespace Users {

      /**
       * Defines the full resource with all properties.
       * 
       * @todo This definition should be moved to the billing.types NPM package to enable sharing with the frontend.
       * 
       * @see {@link https://github.com/screencloud/billing.types Billing Types Package}
       */
      interface User {
        id: string;
        email: string;
        name: string;
      }
      
    }
  }
}