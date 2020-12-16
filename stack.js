export default class Stack {
  constructor(){
    this.stack = [];
  }

  push(el){
    this.stack.push(el)
  }

  pop(){
    if(this.isEmpty()) return 'Stack is empty';
    return this.stack.pop();
  }
  
  isEmpty(){
    return !this.stack.length;
  }
}
