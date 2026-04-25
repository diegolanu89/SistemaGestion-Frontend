// cypress/support/cypress.d.ts
declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('username', 'password')
       */
      login(username: string, password: string): Chainable<void>;
    }
  }
  