const Calculate = {
    factorial(n) {
      if (n == 0) return 1;
      
      let x = 1;
      for (let i=1; i<=n; i++) {
        x*=i;
      }
      return x;
    }
  }
  
  module.exports = Calculate;
  
  
  