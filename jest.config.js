/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage", // Onde salvar os relatórios
  coverageReporters: ["html", "text-summary"], // HTML e um resumo no terminal
  testEnvironment: "node",
  detectOpenHandles: true,
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}], // Corrigido: precisa escapar o ponto
  },
  testPathIgnorePatterns: ["/dist/"],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Relatório de Testes - Gerenciamento de Tarefas Backend",
        outputPath: "./coverage/test-report.html", // Relatório separado dos testes
        includeFailureMsg: true,
        includeConsoleLog: true
      }
    ]
  ]
};
