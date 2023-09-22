import admin from "../fixtures/admin";
import seats from "../fixtures/seats";
import selectors from "../fixtures/selectors";

describe("Main page tests", () => {
  it("should check main page display", () => {
    cy.visit("http://qamid.tmweb.ru");
    cy.get(selectors.mainHeader).should("have.text", "Идёмвкино");
  });
});

describe("Admin login tests", () => {
  it("should check SAD admin panel login ", () => {
    admin.forEach((admin) => {
      cy.adminLogin(admin.email, admin.sadPassword);
      cy.get(selectors.body).should("have.text", "Ошибка авторизации!");
    });
  });

  it("should check HAPPY admin panel login ", () => {
    admin.forEach((admin) => {
      cy.adminLogin(admin.email, admin.password);
      cy.get(selectors.mainSubtitle).should("have.text", "Администраторррская");
    });
  });
});

describe("Seats selection test", () => {
  it("should check booking of two seats", () => {
    cy.adminLogin("qamid@qamid.ru", "qamid");
    cy.get(selectors.movieTitle)
      .last()
      .then(($el) => {
        const FilmName = $el.text();
        cy.visit("http://qamid.tmweb.ru/");
        cy.get(selectors.day).click();
        cy.contains(FilmName).parents(selectors.movie).contains(":00").click();
        seats.forEach((seats) => {
          cy.get(
            selectors.hall +
              `> :nth-child(${seats.row}) > :nth-child(${seats.seat})`
          ).click();
        });
        cy.contains(selectors.bookButton).click();
        cy.get(selectors.getQRbutton).should("be.visible");
        cy.get(selectors.getQRbutton).should(
          "have.text",
          "Получить код бронирования"
        );
      });
  });
});
