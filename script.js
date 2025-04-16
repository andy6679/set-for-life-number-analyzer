// Set For Life Lottery Number Generator
class SetForLifeGenerator {
  constructor() {
    this.mainMin = 1;
    this.mainMax = 47;  // Set For Life has numbers 1-47
    this.lifeBallMin = 1;
    this.lifeBallMax = 10;  // Life ball is 1-10
    this.totalMainNumbers = 5;  // Set For Life has 5 main numbers
  }

  generateNumbers(options = {}) {
    const {
      lines = 5,
      odd = 'any',
      even = 'any',
      low = 'any',
      mid = 'any',
      high = 'any',
      distribution = 'any'
    } = options;

    const results = [];
    
    for (let i = 0; i < lines; i++) {
      let valid = false;
      let attempts = 0;
      const maxAttempts = 1000;
      
      while (!valid && attempts < maxAttempts) {
        attempts++;
        
        // Generate main numbers
        const mainNumbers = this.generateUniqueNumbers(
          this.totalMainNumbers, 
          this.mainMin, 
          this.mainMax
        ).sort((a, b) => a - b);
        
        // Generate life ball
        const lifeBall = this.getRandomNumber(this.lifeBallMin, this.lifeBallMax);
        
        // Check if meets criteria
        valid = this.validateNumbers(mainNumbers, {
          odd, even, low, mid, high, distribution
        });
        
        if (valid) {
          // Calculate stats
          const oddCount = mainNumbers.filter(n => n % 2 === 1).length;
          const evenCount = this.totalMainNumbers - oddCount;
          
          let lowCount = 0, midCount = 0, highCount = 0;
          mainNumbers.forEach(n => {
            if (n <= 15) lowCount++;       // Low range 1-15
            else if (n <= 31) midCount++;  // Mid range 16-31
            else highCount++;              // High range 32-47
          });
          
          results.push({
            mainNumbers,
            lifeBall,
            stats: {
              oddCount,
              evenCount,
              lowCount,
              midCount,
              highCount
            }
          });
        }
      }
      
      if (attempts >= maxAttempts) {
        console.warn(`Could not generate valid line ${i+1} after ${maxAttempts} attempts`);
      }
    }
    
    return results;
  }

  generateUniqueNumbers(count, min, max) {
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(this.getRandomNumber(min, max));
    }
    return Array.from(numbers);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  validateNumbers(numbers, criteria) {
    const { odd, even, low, mid, high, distribution } = criteria;
    
    // Check odd/even
    const oddCount = numbers.filter(n => n % 2 === 1).length;
    const evenCount = numbers.length - oddCount;
    
    if (odd !== 'any' && oddCount !== parseInt(odd)) return false;
    if (even !== 'any' && evenCount !== parseInt(even)) return false;
    
    // Check ranges
    let lowCount = 0, midCount = 0, highCount = 0;
    numbers.forEach(n => {
      if (n <= 15) lowCount++;
      else if (n <= 31) midCount++;
      else highCount++;
    });
    
    if (low !== 'any' && lowCount !== parseInt(low)) return false;
    if (mid !== 'any' && midCount !== parseInt(mid)) return false;
    if (high !== 'any' && highCount !== parseInt(high)) return false;
    
    // Check if ranges add up correctly
    if (low !== 'any' && mid !== 'any' && high !== 'any') {
      if (parseInt(low) + parseInt(mid) + parseInt(high) !== numbers.length) {
        return false;
      }
    }
    
    // Check distribution preference
    switch (distribution) {
      case 'low': if (lowCount < 3) return false; break;
      case 'mid': if (midCount < 3) return false; break;
      case 'high': if (highCount < 3) return false; break;
      case 'balanced': 
        if (lowCount < 1 || midCount < 1 || highCount < 1) return false; 
        break;
    }
    
    return true;
  }

  // Format numbers for display
  formatResult(result) {
    const { mainNumbers, lifeBall, stats } = result;
    
    const formattedMain = mainNumbers.map(n => {
      let className = 'number-ball';
      if (n <= 15) className += ' low-number';
      else if (n <= 31) className += ' mid-number';
      else className += ' high-number';
      
      return `<div class="${className}">${n}</div>`;
    }).join('');
    
    const formattedLifeBall = `<div class="number-ball life-ball">${lifeBall}</div>`;
    
    const statsText = `
      ${stats.oddCount} odd / ${stats.evenCount} even | 
      ${stats.lowCount} low / ${stats.midCount} mid / ${stats.highCount} high
    `;
    
    return `
      <div class="number-line">
        <div class="main-numbers">${formattedMain}</div>
        ${formattedLifeBall}
        <div class="stats">${statsText}</div>
      </div>
    `;
  }
}

// Example usage:
const generator = new SetForLifeGenerator();

const options = {
  lines: 5,
  odd: 'any',
  even: 'any',
  low: 'any',
  mid: 'any',
  high: 'any',
  distribution: 'balanced'
};

const results = generator.generateNumbers(options);
const output = results.map(r => generator.formatResult(r)).join('');
document.getElementById('generatedNumbers').innerHTML = output;