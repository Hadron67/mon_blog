var require = function(a){
  document.write('<script type="text/javascript" src="' + a + '"></script>');
}
var Compiler = (function(){
  'use strict';
  var a = {};
  a.version = '1.0.0';
  var lexique_re = /[a-zA-Z_$]?[a-zA-Z_$0-9]*[a-zA-Z0-9$]|_|(\+|->|-|\*\*|\*|\/\.|\^|>=|<=|>|<|===|==|!|!=|\:=|%|\|\||&&|=|\/|\(|\)|\[\[|\]\]|\[|\]|\||&|;|\{|\}|,)|([0-9]+\.[0-9]*|[0-9]*\.[0-9]+|[0-9]+)([0-9]+[eE]{1}[\+-]?[0-9]+)?/g;
  //-------------------------------------------------
  var sbase = function(){
    this.value = undefined;
    this.parent = undefined;
    this.child = [];
  }
  sbase.prototype.nud = function(){
    throw 'Syntax Error : Unexpected token "' + this.id + '"';
  }
  sbase.prototype.led = function(s){
    throw 'Syntax Error : Unexpected token "' + this.id + '"';
  }
  sbase.prototype.lbp = 0;
  sbase.prototype.id = undefined;
  sbase.prototype.addChild = function(c){
    this.child.push(c);
    c.parent = this;
  }
  sbase.prototype.childIndex = function(c){
    for(var i = 0;i < this.child.length;i++){
      if(this.child[i] == c)
        return i;
    }
    return -1;
  }
  sbase.prototype.strip = function(){
    if(this.parent != undefined){
      var keep = this == this.parent.child[1] ? this.parent.child[0] : this.parent.child[1];
      this.parent.replace(keep);
    }
  }
  sbase.prototype.replace = function(keep){
    if(this.parent != undefined){
      this.parent.child[this.parent.childIndex(this)] = keep;
      keep.parent = this.parent;
    }
  }
  sbase.prototype.toString = function(){
    var s = '';
    var r = function(node,indent){
      for(var i = 0;i < indent;i++){
        s += '  ';
      }
      if(node.child.length == 0){
        s += '<node type="' + node.id + '" value="' + node.value + '"/>\n';
      }
      else{
        s += '<node type="' + node.id + '" value="' + node.value + '">\n';
        for(var i = 0;i < node.child.length;i++){
          r(node.child[i],indent + 1);
        }
        for(var i = 0;i < indent;i++){
          s += '  ';
        }
        s += '</node>\n';
      }
    }
    r(this,0);
    return s;
  }
  a.nombre_token = function(value){
    sbase.call(this);
    this.value = value;
  }
  a.nombre_token.prototype = new sbase();
  a.nombre_token.prototype.constructor = a.nombre_token;
  a.nombre_token.prototype.nud = function(){
    return this;
  }
  a.nombre_token.prototype.id = 'nombre';
  a.nombre_token.prototype.toString = function(){
    return this.value.toString();
  }
  a.string_token = function(value){
    sbase.call(this);
    this.value = value;
  }
  a.string_token.prototype = new sbase();
  a.string_token.prototype.constructor = a.string_token;
  a.string_token.prototype.nud = function(){
    return this;
  }
  a.string_token.prototype.toString = function(){
    return "'" + this.value + "'";
  }
  a.string_token.prototype.id = 'string';
  a.name_token = function(value){
    sbase.call(this);
    this.value = value;
  }
  a.name_token.prototype = new sbase();
  a.name_token.prototype.constructor = a.name_token;
  a.name_token.prototype.nud = function(){
    return this;
  }
  a.name_token.prototype.toString = function(){
    return this.value;
  }
  a.name_token.prototype.id = 'name';
  a.end_token = function(){sbase.call(this);}
  a.end_token.prototype = new sbase();
  a.end_token.prototype.constructor = a.end_token;
  a.end_token.prototype.id = 'EOF';
  //-------------------------------------------------
  var symbol_map = {};
  a.symbol = function(id,lbp){
    var ret = symbol_map[id];
    if(lbp == undefined)lbp = 0;
    if(ret == undefined){
      ret = (symbol_map[id] = function(){
        sbase.call(this);
      });
      ret.prototype = new sbase();
      ret.prototype.constructor = ret;
      ret.prototype.id = id;
      ret.prototype.lbp = lbp;
    }
    return ret;
  }
  a.def_infix = function(id,lbp){
    var ret = a.symbol(id,lbp);
    ret.prototype.led = function(t){
      this.addChild(t);
      this.addChild(a.expression(lbp));
      return this;
    }
    ret.prototype.toString = function(){
      var s = '';
      if(this.lbp > this.child[0].lbp){
        s += '(';
      }
      s += this.child[0].toString();
      if(this.lbp > this.child[0].lbp){
        s += ')';
      }
      s += this.id;
      if(this.lbp > this.child[1].lbp){
        s += '(';
      }
      s += this.child[1].toString();
      if(this.lbp > this.child[1].lbp){
        s += ')';
      }
      return s;
    }
    return ret;
  }
  a.def_prefix = function(id,lbp){
    var ret = a.symbol(id,lbp);
    ret.prototype.nud = function(){
      this.addChild(a.expression(lbp));
      return this;
    }
    return ret;
  }
  //--------------------------------------------------
  var token;
  var next;
  var input = '';
  var Lexiqueur = function(s){
    var cut = function(s){ return s.substr(1,s.length - 1); }
    var ma = lexique_re.exec(s);
    if(ma == null){
      return new a.end_token();
    }
    var mat = ma[0];
    if(/^[a-zA-Z_$]+[a-zA-Z_$0-9]*$/.test(mat)){
      return new a.name_token(mat);
    }
    else if(/^\'.*\'|\".*\"$/.test(mat)){
      return new a.string_token(cut(mat));
    }
    else if(/^([0-9]+\.[0-9]*|[0-9]*\.[0-9]+|[0-9]+)([0-9]+[eE]{1}[\+-]?[0-9]+)?$/.test(mat)){
      return new a.nombre_token(mat);
    }
    else{
      var ret = symbol_map[mat];
      if(ret == undefined){
        throw 'Lexical error: Unknown symbol:"' + s.charAt(lexique_re.lastIndex - 1) + '"';
      }
      return new ret;
    }
  }
  a.expression = function(rbp){
    var t = token;
    token = Lexiqueur(input);
    var left = t.nud();
    while(rbp < token.lbp){
      t = token;
      token = Lexiqueur(input);
      left = t.led(left);
    }
    return left;
  }
  a.advance = function(id){
    if(id != undefined && token.id != id){
      throw 'Syntax Error: expected "' + id + '" ,but "' + token.id + '" found instead.';
    }
    token = Lexiqueur(input);
  }
  a.compile = function(s){
    lexique_re.lastIndex = 0;
    input = s;
    token = Lexiqueur(input);
    var ret = a.expression(0);
    a.advance('EOF');
    return ret;
  }
  var set_m = function(){
    symbol_map = {};
    //binary operators
    a.def_infix('/.',20);
    a.def_infix(':=',20);
    a.def_infix('=',20);
    a.def_infix('||',30);
    a.def_infix('&&',40);
    a.def_prefix('!',50);
    a.def_infix('<',60);
    a.def_infix('>',60);
    a.def_infix('<=',60);
    a.def_infix('>=',60);
    a.def_infix('==',60);
    a.def_infix('!=',60);
    
    a.def_infix('->',100);
    a.def_infix('+',110).prototype.nud = function(){
      return a.expression(this.lbp);
    }
    a.def_infix('-',110).prototype.toString = function(){
      var s = '';
      if(this.lbp > this.child[0].lbp){
        s += '(';
      }
      s += this.child[0].toString();
      if(this.lbp > this.child[0].lbp){
        s += ')';
      }
      s += this.id;
      if(this.lbp >= this.child[1].lbp){
        s += '(';
      }
      s += this.child[1].toString();
      if(this.lbp >= this.child[1].lbp){
        s += ')';
      }
      return s;
    }
    a.def_infix('*',120);
    a.def_infix('/',120).prototype.toString = function(){
      var s = '';
      if(this.lbp > this.child[0].lbp){
        s += '(';
      }
      s += this.child[0].toString();
      if(this.lbp > this.child[0].lbp){
        s += ')';
      }
      s += this.id;
      if(this.lbp >= this.child[1].lbp){
        s += '(';
      }
      s += this.child[1].toString();
      if(this.lbp >= this.child[1].lbp){
        s += ')';
      }
      return s;
    }
    a.def_infix('^',130);
    
    a.symbol('(',150).prototype.nud = function(){
      var ret = a.expression(10);
      a.advance(')');
      return ret;
    }
    a.symbol(')',0);
    a.symbol('[',150).prototype.led = function(t){
      this.addChild(t);
      if(token.id == ']'){
        a.advance();
        return this;
      }
      this.addChild(a.expression(10));
      while(token.id != ']'){
        a.advance(',');
        this.addChild(a.expression(10));
      }
      a.advance(']');
      return this;
    }
    a.symbol('[').prototype.toString = function(){
      var s = '';
      if(this.child[0].id == 'name'){
        s += this.child[0].value + '[';
      }
      else{
        s += '(' + this.child[0].toString() + ')[';
      }
      if(this.child.length == 1){
        return s + ']';
      }
      else{
        s += this.child[1].toString();
        for(var i = 2;i < this.child.length;i++){
          s += ',' + this.child[i].toString();
        }
        return s + ']';
      }
    }
    a.symbol(']');
    a.symbol('[[',150).prototype.led = function(t){
      this.addChild(t);
      this.addChild(a.expression(10));
      while(token.id != ']]'){
        a.advance(',');
        this.addChild(a.expression(10));
      }
      a.advance(']]');
      return this;
    }
    a.symbol('[[',150).prototype.toString = function(){
      var s = '';
      if(this.child[0].id == 'name'){
        s += this.child[0].value + '[[';
      }
      else{
        s += '(' + this.child[0].toString() + ')[[';
      }
      s += this.child[1].toString();
      for(var i = 1;i < this.child.length;i++){
        s += ',' + this.child[i].toString();
      }
      return s + ']]';
    }
    a.symbol(']]');
    a.symbol(',',0);
    a.symbol('{',150).prototype.nud = function(){
      if(token.id == '}'){
        a.advance();
        return this;
      }
      this.addChild(a.expression(10));
      while(token.id != '}'){
        a.advance(',');
        this.addChild(a.expression(10));
      }
      a.advance('}');
      return this;
    };
    a.symbol('{',150).prototype.toString = function(){
      if(this.child.length == 0){
        return '{}';
      }
      else{
        var s = '';
        s += this.child[0].toString();
        for(var i = 1;i < this.child.length;i++){
          s += ',' + this.child[i].toString();
        }
        return s + '}';
      }
    }
    a.symbol('}',0);
    a.nombre_token.prototype.lbp = 200;
    a.name_token.prototype.lbp = 200;
    a.string_token.prototype.lbp = 200;
  }
  a.setLanguage = function(l){
    switch(l){
      case 'Mathematica':
        set_m();
        break;
      default:
        throw 'language "' + l + '" is not supported yet.';
        break;
    }
  }
  return a;
})();
var MathRun = (function(){
  require('/programmes/mjs/complex.js');
  var a = {};
  a.version = '1.0.0';
  a.Null = {
    id : 'null',
    toString : function(){
      return 'Null';
    }
  };
  /*a.Atom = function Atom(type,value){
    this.type = type;
    this.value = value;
  }
  a.Atom.prototype.id = 'atom';
  a.Atom.prototype.plus = function(a1){
    if(this.type == 'nombre' && a1.type == 'nombre'){
      return new a.Atom('nombre',this.value.plus(a1.value));
    }
  }
  a.Atom.prototype.mult = function(a1){
    if(this.type == 'nombre' && a1.type == 'nombre'){
      return new a.Atom('nombre',this.value.multiply(a1.value));
    }
  }
  a.Atom.prototype.invert = function(){
    if(this.type == 'nombre'){
      return new a.Atom('nombre',this.value.invert());
    }
  }
  a.Atom.prototype.toString = function(){
    return this.value.toString();
  }
  a.Polynomial = function Polynomial(n){
    this.terms = [];
  }
  a.Polynomial.prototype.id = 'polynomial';
  a.Polynomial.prototype.toString = function(){
    var s = '';
    for(var i = 0;i < this.terms.length;i++){
      if((this.terms[i].coefficient.re > 0) && i != 0){
        s += '+';
      }
      s += this.terms[i].toString;
    }
  }
  a.Term = function Term(n1){
    if(n1 != undefined){
      this.coefficient = new Complex(1,0);
      this.factors = [];
      var nodes = [{inverted : false,obj : n1}];
      while(nodes.length > 0){
        var n = nodes.pop();
        switch(n.obj.id){
          case '*':{
            nodes.push({inverted : n.inverted,obj : n.obj.child[1]});
            nodes.push({inverted : n.inverted,obj : n.obj.child[0]});
            break;
          }
          case '/':{
            nodes.push({inverted : !n.inverted,obj : n.obj.child[1]});
            nodes.push({inverted : n.inverted,obj : n.obj.child[0]});
            break;
          }
          default:
            this.factors.push({inverted : n.inverted,obj : a.Evaluate(n.obj)});
        }
      }
    }
    this.simplify();
  }
  a.Term.try_mult = function(o1,o2){
    var n1 = o1.obj;
    var n2 = o2.obj;
    if(n1.id == 'atom' && n1.id == 'atom'){
       if(o1.inverted) n1 = n1.invert();
       if(o2.inverted) n2 = n2.invert();
       return {inverted : false,obj : n1.mult(n2)};
    }
    return undefined;
  }
  a.Term.prototype.id = 'term';
  a.Term.prototype.simplify = function(){
    for(var i = 0;i < this.factors.length;i++){
      if(this.factors[i].obj.id == 'atom' && this.factors[i].obj.type == 'nombre'){
        this.coefficient = this.coefficient.multiply(this.factors[i].obj.value);
        this.factors.splice(i,1);
      }
      for(var j = i + 1;j < this.factors.length;j++){
        var tp = a.Term.try_mult(this.factors[i],this.factors[j]);
        if(tp.obj != undefined){
          this.factors[i] = tp;
          this.factors.splice(j--,1);
        }
      }
    }
  }
  a.Term.prototype.toString = function(){
    var s = '(' + this.coefficient.toString() + ')';
    for(var i = 0;i < this.factors.length;i++){
      var f = this.factors[i].obj;
      if(this.factors[i].inverted){
        s += '/';
      }
      else if(i != 0){
        s += '*';
      }
      if(f.id == 'function' || f.id == 'subscript' || f.id == 'atom' || f.id == 'exp'){
        s += f.toString();
      }
      else {
        s += '(' + f.toString() + ')';
      }
    }
    return s;
  }
  a.Exp = function Exp(base,e){
    this.base = base;
    this.power = e;
  }
  a.Exp.prototype.id = 'exp';
  a.Exp.prototype.toString = function(){
    var s = this.base.toString();
    if(this.power.id == 'atom' && this.power.type == 'nombre' && this.power.value.re == 1 && this.power.value.im == 0){
      return s;
    }
  }
  a.Function = function Function(name){
    this.fname = name;
    this.args = [];
  }
  a.Function.prototype.toString = function(){
    var s = this.fname + '[';
    for(var i = 0;i < this.args.length;i++){
      if(i != 0){
        s += ',';
      }
      s+= this.args[i].toString();
    }
    return s + ']';
  }
  a.Function.prototype.id = 'function';
  a.Subscript = function(left,s){
    this.array = left;
    this.subscript = s;
  }
  a.Subscript.prototype.toString = function(){
    var s = this.array.toString() + '[[';
    for(var i = 0;i < this.args.length;i++){
      if(i != 0){
        s += ',';
      }
      s+= this.args[i].toString();
    }
    return s = ']]';
  }
  a.Subscript.prototype.id = 'subscript';
  a.Optr = function(id,left,right){
    this.id = id;
    this.left = left;
    this.right = right;
  }*/

  var scope = {parent : undefined};
  //scope['I'] = new Complex(0,1);
  //scope['ComplexInfinity'] = Complex.ComplexInfinity;
  var functions = {};
  var operators = {};
  a.def_function = function(name,f){
    functions[name] = f;
    return a;
  }
  a.def_operator = function(n,f){
    operators[n] = f;
    return a;
  }
  void function(){
    //closure for computation techn
    var find_terms = function(n){
      var terms = [];
      var nodes = [n];
      while(nodes.length > 0){
        var node = nodes.pop();
        if(node.obj.id == '+'){
          nodes.push({
            negtive : node.negtive,
            obj : node.obj.child[1]
          });
          nodes.push({
            negtive : node.negtive,
            obj : node.obj.child[0]
          });
        }
        else if(node.obj.id == '-'){
          nodes.push({
            negtive : !node.negtive,
            obj : node.obj.child[1]
          });
          nodes.push({
            negtive : node.negtive,
            obj : node.obj.child[0]
          });
        }
        else{
          terms.push(node);
        }
      }
      return terms;
    }
    var try_plus = function(n1,n2){
      if(n1.obj.id == 'nombre' && n2.obj.id == 'nombre'){
        var v1 = n1.obj.value;
        var v2 = n2.obj.value;
        if(n1.negtive)
          v1 = v1.neg();
        if(n2.negtive)
          v2 = v2.neg();
        return new Compiler.nombre_token(v1.plus(v2));
      }
      return undefined;
    }
    var func_plus = function(n){
      var terms = find_terms({ negtive : false,obj : n });
      for(var i = 0;i < terms.length;i++){
        var r = a.Run(terms[i].obj);
        terms[i].obj.replace(r);
        terms[i].obj = r;
      }
      for(var i = 0;i < terms.length;i++){
        for(var j = i + 1;j < terms.length;j++){
          var rp = try_plus(terms[i],terms[j]);
          if(rp != undefined){
            terms[i].obj.replace(rp);
            if(terms[j].obj.parent == n){
              n = terms[j].obj == n.child[0] ? n.child[1] : n.child[0];
            }
            else {
              terms[j].obj.strip();
            }
            terms[i].obj = rp;
            terms.splice(j--,1);
          }
        }
      }
      return n;
    }
    a.def_operator('+',function(n){
      return func_plus(n);
    });
    a.def_operator('-',function(n){
      return func_plus(n);
    });
    a.def_operator('*',function(n){
      return n;
    });
    a.def_operator('/',function(n){
      return n;
    });
    a.def_operator('^',function(n){
      return n;
    });
    a.def_function('Sin',function(c){
      return c;
    });
    a.def_function('Cos',function(c){
      return c;
    });
    a.def_function('Clear',function(c){
      var str = a.Run(c[0]);
      switch(str){
        case 'all':
          scope = {parent : undefined};
          break;
        default:;
      }
      return new Complex(0,0);
    });
  }();
  
  a.Run = function(n){
    if(n.id == 'nombre'){
      n.value = new Complex(Number(n.value),0);
      return n;
    }
    else if(n.id == 'name'){
      if(n.value == 'I'){
        var ret = new Compiler.nombre_token(new Complex(0,1));
        ret.parent = n.parent;
        return ret;
      }
      else if(n.value == 'ComplexInfinity'){
        var ret = new Compiler.nombre_token(Complex.ComplexInfinity);
        ret.parent = n.parent;
        return ret;
      }
      else{
        var ret = scope[n.value];
        if(ret != undefined){
          if(ret.delayed)
            return a.Run(ret.obj);
          else
            return ret.obj;
        }
        return n;
      }
    }
    else if(n.id == '['){
      var func = functions[n.child[0].value];
      for(var i = 1;i < n.child.length;i++){
        n.child[i] = a.Run(n.child[i]);
      }
      if(func == undefined){
        return n;
      }
      return func(n);
    }
    else if(n.id == '='){
      var ret = a.Run(n.child[1]);
      a.assign(n.child[0],ret,false);
      return ret;
    }
    else if(n.id == ':='){
      a.assign(n.child[0],n.child[1],true);
      return a.Null;
    }
    else{
      var optr = operators[n.id];
      if(optr == undefined){
        return n;
      }
      return optr(n);
    }
  }
  /*a.Evaluate = function(node){
    if(node.id == 'nombre'){
      return new a.Atom('nombre',new Complex(Number(node.value),0));
    }
    else if(node.id == 'name'){
      var ret = scope[node.value];
      if(ret == undefined){
        return new a.Atom('name',node.value);
      }
      else{
        if(ret.delayed)
          return a.Evaluate(ret);
        else
          return ret;
      }
    }
    else{
      var optr = operators[node.id];
      if(optr == undefined){
        return new a.Optr(node.id,node.child[0],node.child[1]);
      }
      return optr(node);
    }
  }*/
  a.assign = function(a,value,delay){
    if(a.id == 'name'){
      scope[a.value] = { delayed : delay,obj : value };
    }
  }
  
  return a;
})();


