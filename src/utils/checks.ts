export function isNaturalNumber(n: any): boolean {
  let ns = n.toString();
  var n1 = Math.abs(n),
      n2 = parseInt(ns, 10);
  return !ns.includes(',') && !ns.includes('-') && !isNaN(n1) && n2 === n1 && n1.toString() === n.toString();
}