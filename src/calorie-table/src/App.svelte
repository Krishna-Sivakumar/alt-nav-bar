<script lang="ts">
  /*
  let {
    excelForm,
    regularForm,
  }: { excelForm: string[][]; regularForm: string[][] } = $props();
  */

  // take values through globalThis instead

  let isExcel = $state(false);
  let headings = $derived(
    isExcel
      ? ["Meal Name", "Item", "Excel Form"]
      : ["Meal Name", "Item", "Energy (cal)"],
  );

  //@ts-ignore
  // globalThis.excelForm = [
  //   ["Sandwich", "2 Slices Sourdough Bread", "=2 * 100"],
  //   ["", "0.5 Serving Avocado	", "=0.5 * 120"],
  //   ["", "0.2 tbsp Butter", "=0.2 * 100"],
  //   ["", "1 Hash Brown", "=1 * 120"],
  //   ["", "1 tbsp Pesto", "=1 / 4 * 350"],
  // ];

  //@ts-ignore
  // globalThis.regularForm = [
  //   ["Sandwich", "2 Slices Sourdough Bread", "200"],
  //   ["", "0.5 Serving Avocado", "60"],
  //   ["", "0.2 tbsp Butter", "20"],
  //   ["", "1 Hash Brown", "120"],
  //   ["", "1 tbsp Pesto", "87.5"],
  // ];

  //@ts-ignore
  const excelForm = globalThis.excelForm as string[][];
  //@ts-ignore
  const regularForm = globalThis.regularForm as string[][];

  let data = $derived(isExcel ? excelForm : regularForm);

  let totalCalories = $derived(
    regularForm
      .map((row) => parseFloat(row.at(2) || "0"))
      .reduce((sum, val) => sum + val, 0),
  );

  function copy() {
    navigator.clipboard.writeText(
      data.map((row) => row.map((item) => item.trim()).join("\t")).join("\n"),
    );
  }
</script>

<div style="display: flex; gap: 1em;">
  <button onclick={() => (isExcel = !isExcel)}>Toggle Mode</button>
  <button onclick={copy}>Copy</button>
</div>
<table>
  <thead>
    <tr>
      {#each headings as heading}
        <td>{heading}</td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as row}
      <tr>
        {#each row as cell}
          <td>{cell}</td>
        {/each}
      </tr>
    {/each}
    <tr>
      <td>Total Calories</td>
      <td></td>
      <td>{totalCalories}</td>
    </tr>
  </tbody>
</table>

<style>
  table {
    color: white;
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0 0 0;
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

  tbody > tr:last-child {
    background: black;
    font-weight: bold;
  }

  td {
    padding: 0.6rem;
  }

  button {
    padding: 0.25em 1em;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid gray;
    border-radius: 4px;
    font-weight: bold;
    color: white;
    font-size: medium;
  }
</style>
