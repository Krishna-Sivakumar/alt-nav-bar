import { parse } from "./parser/index.ts";
import { Item, Meal, Var, VarArith, VarMul, VarTerm } from "./parser/types.ts";

import calorieTableHtml from "./calorie-table/dist/calorie-table.html.ts";
import calorieTableJs from "./calorie-table/dist/calorie-table.script.ts";

function evaluateFormula(
  node: VarArith | VarMul | VarTerm | number,
  variable: number,
): number {
  if (typeof node == "number") {
    return node;
  }

  switch (node.type) {
    case "variable":
      return variable;
    case "*":
      return evaluateFormula(node.left, variable) *
        evaluateFormula(node.right, variable);
    case "/":
      return evaluateFormula(node.right, variable) /
        evaluateFormula(node.left, variable);
    case "+":
      return evaluateFormula(node.left, variable) +
        evaluateFormula(node.right, variable);
    case "-":
      return evaluateFormula(node.left, variable) -
        evaluateFormula(node.right, variable);
    default:
      if (typeof node == "number") {
        return node;
      } else {
        throw Error("unreachable; wonky logic");
      }
  }
}

export function replaceVariable(tree: Meal, serving: number): Meal {
  function dfs(node: VarArith | VarMul | VarTerm | Var | number) {
    if ("type" in node && node.type == "variable") {
      return serving;
    }
    return node;
  }

  return {
    name: tree.name,
    items: tree.items.map((item) => ({
      ...item,
      formula: dfs(item.formula),
    } as unknown as Item)),
  };
}

function stringForm(tree: VarArith, serving: number): string {
  function dfs(node: VarArith | VarMul | VarTerm | Var | number): string {
    if (typeof node == "number") {
      return node.toString();
    }

    if (node.type) {
      if (node.type != "variable") {
        return `${dfs(node.left)} ${node.type} ${dfs(node.right)}`;
      } else {
        return serving.toString();
      }
    } else {
      return node.toString();
    }
  }
  return dfs(tree);
}

export function evaluateCalories(
  content: string,
) {
  const tree = parse(content);
  const evaledObject = {
    name: tree.name,
    items: tree.items.map((item) => ({
      name: item.name.trim(),
      serving: `${item.serving} ${item.unit}`,
      energy: evaluateFormula(item.formula, item.serving),
    })),
  };
  return evaledObject;
}

export function evaluateCaloriesExcel(
  content: string,
) {
  const tree = parse(content);
  const evaledObject = {
    name: tree.name,
    items: tree.items.map((item) => ({
      name: item.name.trim(),
      serving: `${item.serving} ${item.unit}`,
      energy: "=" + stringForm(item.formula, item.serving),
    })),
  };
  return evaledObject;
}

function calorieDataToTable(
  data:
    | ReturnType<typeof evaluateCalories>
    | ReturnType<typeof evaluateCaloriesExcel>,
) {
  const table = [];
  if (data.items.length > 0) {
    table.push([
      data.name,
      `${data.items[0].serving} ${data.items[0].name}`,
      data.items[0].energy,
    ]);
    data.items.slice(1).forEach((item) => {
      table.push([
        "",
        `${item.serving} ${item.name}`,
        item.energy,
      ]);
    });
  }
  return table;
}

export function calorieWidget(
  contents: string,
): { script: string; html: string } {
  const excelForm = calorieDataToTable(evaluateCaloriesExcel(contents));
  const normalForm = calorieDataToTable(evaluateCalories(contents));

  const script = `
    globalThis.excelForm = ${JSON.stringify(excelForm)};
    globalThis.regularForm = ${JSON.stringify(normalForm)};
    ${calorieTableJs}
  `;
  return {
    html: calorieTableHtml,
    script: script,
  };
}
