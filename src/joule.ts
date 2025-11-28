import { parse } from "./parser/index.ts";
import { Item, Meal, Var, VarArith, VarMul, VarTerm } from "./parser/types.ts";

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
export function calorieWidget(
  contents: string,
): { script: string; html: string } {
  const content = evaluateCaloriesExcel(contents);

  const headings = ["Meal Name", "Item", "Excel Form"];
  const table = [];

  if (content.items.length > 0) {
    table.push([
      content.name,
      `${content.items[0].serving} ${content.items[0].name}`,
      content.items[0].energy,
    ]);
    content.items.slice(1).forEach((item) => {
      table.push([
        "",
        `${item.serving} ${item.name}`,
        item.energy,
      ]);
    });
  }

  const tsv = table.map(
    (row) => row.map((item) => `${item}`).join("\t"),
  ).join("\n");

  const htmlHeadings = headings.map((item) => `<td>${item}</td>`).join("");
  const htmlData = table.map(
    (row) =>
      `<tr>${
        row.map((item) => "<td>" + item.toString() + "</td>").join("")
      }</tr>`,
  ).join("");

  const style = `
<style>
table {
    color: white;
    width: 100%;
    border-collapse: collapse;
}

tr:nth-child(odd) {
    background: black;
}

tbody > tr:nth-child(even) {
    background: black;
}

tbody > tr:nth-child(odd) {
    background: gray;
}

td {
    padding: 0.6rem;
}
</style>`;

  const htmlTable = `
    <table>
      <thead>
        <tr>${htmlHeadings}</tr>
      </thead>
      <tbody>
        ${htmlData}
      </tbody>
    </table>
  `;

  console.log(headings, table, htmlTable);

  return {
    html: `${htmlTable}<button id="glax">copy</button>${style}`,
    script: `
    document.querySelector("#glax").addEventListener("click", () => {
      navigator.clipboard.writeText(\`${tsv}\`)
    })
    `,
  };
}
