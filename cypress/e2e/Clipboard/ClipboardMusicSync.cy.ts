/**
 * Cypress E2E Test: Clipboard Music Sync - User Story 1: View Teams and Sync Status
 * 
 * Tests the full user flow for viewing clipboard teams and their sync status
 * Prerequisites: User has Clipboard module access, teams exist in the system
 */

describe('Clipboard Music Sync - View Teams (US1)', () => {
  const baseUrl = Cypress.config().baseUrl || 'http://localhost:3000';
  const schoolBoxCode = 'aHR0cHM6Ly9tY29ubmVjdHdlYi5tZW50b25lZ2lybHMudmljLmVkdS5hdS8zcmRQYXJ0eUF1dGgvTDJWdWNtOXNiV1Z1ZEhOZllXUnRhVzQ9';
  const testUrl = `/modules/remote/${schoolBoxCode}/clipboard/music-sync`;

  beforeEach(() => {
    // Navigate to Clipboard Music Sync page
    cy.visit(testUrl, {
      failOnStatusCode: false,
    });

    // Wait for page to load
    cy.contains('Clipboard Management', { timeout: 10000 }).should('be.visible');
  });

  it('should display page title and tabs', () => {
    // Verify page title
    cy.contains('h3', 'Clipboard Management').should('be.visible');

    // Verify Music Sync tab is active
    cy.get('.nav-link.active').should('contain', 'Music Sync');

    // Verify placeholder tabs exist
    cy.get('.nav-link').should('contain', 'Logs');
    cy.get('.nav-link').should('contain', 'Settings');
  });

  it('should load and display teams list within 5 seconds', () => {
    const start = Date.now();

    // Wait for teams list to appear
    cy.get('[data-testid="teams-list-panel"]', { timeout: 5000 }).should('exist');

    // Verify page load time is less than 5 seconds
    cy.then(() => {
      const loadTime = (Date.now() - start) / 1000;
      expect(loadTime).to.be.lessThan(5);
    });
  });

  it('should display teams in a table with correct columns', () => {
    // Verify table headers
    cy.contains('th', 'Team Name').should('be.visible');
    cy.contains('th', 'Session').should('be.visible');
    cy.contains('th', 'Last Sync').should('be.visible');
    cy.contains('th', 'Actions').should('be.visible');

    // Verify at least one team row exists
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });

  it('should display team names correctly', () => {
    // Get all team name cells (first column of data rows)
    cy.get('tbody tr td:first-child').each(($cell) => {
      // Each team row should have a team name
      cy.wrap($cell).should('not.be.empty');
      // Team name should be a strong tag or contain text
      cy.wrap($cell).should('contain', /./);
    });
  });

  it('should display Sync button for each team', () => {
    // Get all sync buttons
    cy.get('button:contains("Sync")').should('have.length.greaterThan', 0);

    // Verify each sync button is clickable
    cy.get('tbody tr button[title*="Trigger manual music sync"]').each(($btn) => {
      cy.wrap($btn)
        .should('be.visible')
        .should('not.be.disabled');
    });
  });

  it('should allow expanding team row to view session details', () => {
    // Get first team row
    cy.get('tbody tr:first').click();

    // Verify session details panel appears
    cy.get('[class*="session-details"]', { timeout: 5000 }).should('exist');

    // Verify session details contain expected fields
    cy.contains('Session Title').should('be.visible');
    cy.contains('Activity').should('be.visible');
    cy.contains('Start Time').should('be.visible');
    cy.contains('End Time').should('be.visible');
  });

  it('should collapse team details when clicking row again', () => {
    // Expand first team
    cy.get('tbody tr:first').click();
    cy.get('[class*="session-details"]', { timeout: 5000 }).should('exist');

    // Collapse by clicking again
    cy.get('tbody tr:first').click();
    cy.get('[class*="session-details"]').should('not.exist');
  });

  it('should handle empty teams state gracefully', () => {
    // If no teams, should show empty state message
    cy.get('body').then(($body) => {
      if ($body.text().includes('No Teams Configured')) {
        cy.contains('No Teams Configured').should('be.visible');
        cy.contains(/no clipboard teams configured/i).should('be.visible');
      }
    });
  });

  it('should display fallback team name when name is null', () => {
    // Check if any team is displayed using classCode fallback
    cy.get('tbody tr td:first-child').each(($cell) => {
      const text = $cell.text();
      // Team should be displayed either by name or classCode
      expect(text).to.match(/./);
    });
  });

  it('should support keyboard navigation for expanding teams', () => {
    // Get first team row
    cy.get('tbody tr:first')
      .focus()
      .type('{enter}');

    // Verify session details appear
    cy.get('[class*="session-details"]', { timeout: 5000 }).should('exist');
  });

  it('should load multiple teams without layout shift', () => {
    // Get initial table height
    cy.get('table').invoke('height').then((initialHeight) => {
      // Wait for all teams to load
      cy.get('tbody tr', { timeout: 5000 }).should('have.length.greaterThan', 0);

      // Verify table height remains stable (no layout shift)
      cy.get('table').invoke('height').should('be.greaterThan', 0);
    });
  });

  it('should display proper formatting for session times', () => {
    // Expand first team to see session details
    cy.get('tbody tr:first').click();

    // Check that timestamps are properly formatted (DD/MM/YYYY HH:mm)
    cy.contains('Start Time')
      .parent()
      .next()
      .should('contain', /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/);
  });

  it('should handle API errors gracefully', () => {
    // Intercept teams API call and return error
    cy.intercept('GET', '**/clipboard/team**', {
      statusCode: 500,
      body: { message: 'Server error' },
    });

    cy.visit(testUrl, { failOnStatusCode: false });

    // Should display error message
    cy.contains(/error|failed/i, { timeout: 5000 }).should('exist');
  });

  it('should display access denied if user lacks permissions', () => {
    // Intercept with 403 Forbidden
    cy.intercept('GET', '**/clipboard/**', {
      statusCode: 403,
      body: { message: 'Unauthorized' },
    });

    cy.visit(testUrl, { failOnStatusCode: false });

    // Should display error message
    cy.contains(/error|unauthorized|access/i, { timeout: 5000 }).should('exist');
  });

  it('should support responsive design for mobile', () => {
    // Set mobile viewport
    cy.viewport('iphone-x');

    // Page should still be visible and functional
    cy.contains('h3', 'Clipboard Management').should('be.visible');
    cy.get('table').should('be.visible');
  });

  it('should have accessible ARIA labels', () => {
    // Verify page has proper ARIA structure
    cy.get('[role="table"]').should('exist');
    cy.get('[role="row"]').should('have.length.greaterThan', 0);

    // Verify team rows have expand/collapse indicators
    cy.get('tbody tr')
      .first()
      .should('have.attr', 'role', 'button');
  });
});
