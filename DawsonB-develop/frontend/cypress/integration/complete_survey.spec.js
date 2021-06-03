describe('Completing a survey', () => {
  it('Displays a success message', () => {
    cy.visit('http://localhost:3000');

    cy.get('[data-testid="saQuestion"]')
      .each((item) => {
        cy.wrap(item)
          .type('My answer');
      });

    // other question types here
    //tests for radio button questoin. MCRQuestion component
    cy.get('[data-testid="mcrQuestion"]')
      .each((item) => {
        cy.wrap(item)
          .check();
      });
      //tests checkbox questoin. MCCQuestion
      cy.get('[data-testid="mccQuestion"]')
      .each((item) => {
        cy.wrap(item)
          .check();
      });
    cy.get('[data-testid="submitSurvey"]')
      .click();

    cy.contains('Thank you for taking the survey!');
  });
});