/// <reference types="cypress" />
import Body from "../../src/components/Body"

describe('<Body />', () => {
    it('mounts', () => {
        cy.mount(Body);
    })
})