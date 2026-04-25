// Describe el conjunto de pruebas para la "Home Page"
describe("Home Page", () => {
  // Caso de prueba: Verifica que se cargue correctamente la página de inicio
  it("should load the home page", () => {
    // Visita la raíz del sitio ("/"), que suele ser redireccionada o mostrar el login
    cy.visit("/").wait(1000); // Espera 1 segundo para asegurar que la carga haya finalizado

    // Verifica que en la página aparezca el texto "Iniciar sesión"
    // Podés ajustar el texto a lo que esperás que se vea en esa pantalla
    cy.contains("Iniciar sesión");
  });
});
