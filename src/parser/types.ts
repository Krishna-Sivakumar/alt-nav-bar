export type _ = string;
export type Num = number;
export type Mul = number;
export type Arith = number;
export type Var = { type: "variable" };
export type VarTerm = Var | Num;
export type VarDiv = {
  type: string;
  left: VarDiv | VarTerm;
  right: VarDiv | VarTerm;
};
export type VarMul = {
  type: string;
  left: VarMul | VarDiv | VarTerm;
  right: VarMul | VarDiv | VarTerm;
};
export type VarArith = {
  type: string;
  left: VarArith | VarMul;
  right: VarArith | VarMul;
};
export type String = string;
export type Name = string;
export type Unit = string;
export type Item = {
  serving: Arith;
  unit: Unit;
  name: Name;
  formula: VarArith;
};
export type Items = Item[];
export type Meal = { name: String; items: Items };
