export default {
  input: "parser.pegjs",
  output: "parser.js",
  dts: true,
  allowedStartRules: ["Meal"],
  returnTypes: {
    "_": "_",
    "Num": "types.Num",
    "Term": "types.Term",
    "Mul": "types.Mul",
    "Arith": "types.Arith",
    "Var": "types.Var",
    "VarTerm": "types.VarTerm",
    "VarDiv": "types.VarDiv",
    "VarMul": "types.VarMul",
    "VarArith": "types.VarArith",
    "String": "types.String",
    "Name": "types.Name",
    "Unit": "types.Unit",
    "Item": "types.Item",
    "Items": "types.Items",
    "Meal": "types.Meal"
  }
}
