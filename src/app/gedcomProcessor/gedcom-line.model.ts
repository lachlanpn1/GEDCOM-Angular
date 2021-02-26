export class GEDCOMLine {
  quantifier: Number;
  header: String;
  content: String;

  constructor(quantifier: Number, header: String, content: String) {
    this.quantifier = quantifier;
    this.header = header;
    this.content = content;
  }
}
