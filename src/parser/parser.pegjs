Meal = name:String "\n" items:Items {return {name, items}}

Items = Item*

Item = _ serving:Arith unit:Unit? name:Name _ "(" formula:VarArith ")" _ {
		return {serving, unit: unit || "", name, formula}
    }

Unit = _ unit:(
	"serving"
    / "slice" / "slices"
    / "grams" / "gram" / "g"
    / "cups" / "cup"
    / "tablespoon" / "tbsp"
    / "teaspoon" / "tsp"
) _ { return unit }

Name = _ name:String _ { return name }

String = [A-z0-9 '";,]+ { return text() }

//-- Variable Expressions --
VarArith
	= _ left:VarMul _ right:((("+" / "-") VarMul)*)? _ {
    	let acc = left;
        for (let idx in right) {
        	const [op, val] = right[idx];
            acc = {type: op, left: val, right: acc}
        }
        return acc
    }
    
VarMul
	= _ left:VarTerm _ right:((("*" / "/") VarTerm)*)? _ {
    	let acc = left;
        for (let idx in right) {
        	const [op, val] = right[idx];
            acc = {type: op, left: val, right: acc}
        }
        return acc;
    }

VarTerm
	= _ num:Num _ { return num }
    / "(" expr:Arith ")" { return expr }
    / Var

Var
	= _ "serving" / "s" _ { return {type: "variable"} }
// -- Pure Expressions --

Arith
	= _ left:Mul _ right:((("+" / "-") Mul)*)? _ {
    	let acc = left;
        for (let idx in right) {
        	const [op, val] = right[idx];
            if (op == "+") acc = {}
            else if (op == "-") acc -= val
        }
        return acc
    }
    
Mul
	= _ left:Term _ right:((("*" / "/") Term)*)? _ {
    	let acc = left;
        for (let idx in right) {
        	const [op, val] = right[idx];
            if (op == "*") acc *= val;
            else if (op == "/") acc /= val
        }
        return acc;
    }

Term
	= _ num:Num _ { return num }
    / "(" expr:Arith ")" { return expr }

Num
	= [0-9]+("."[0-9]+)? { return parseFloat(text()) }

_ "whitespace"
	= [ \t\n\r]*
