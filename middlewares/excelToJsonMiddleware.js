const excelToJson = require("convert-excel-to-json");

const excelData = (filePath) => excelToJson({
    sourceFile: filePath,
    header: {
      rows: 1,
    },
    columnToKey: {
      A: "cin",
      B: "nom",
      C: "prenom",
      D: "email",
      E: "tel",
      F: "codeG",
    },
  }).Sheet1; 

  
module.exports = { excelData };