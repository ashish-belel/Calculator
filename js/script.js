// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display'); // your display section
  const buttons = document.querySelectorAll('.but');   // all calculator buttons

  let expression = ''; // stores the current expression

  // Helper: update display
  function updateDisplay() {
    display.textContent = expression || '0';

    // Auto-scroll to the right when text exceeds display width
    display.scrollLeft = display.scrollWidth;
  }

  // Helper: clear display
  function clearAll() {
    expression = '';
    updateDisplay();
  }

  // Helper: check if character is operator
  const isOperator = ch => ['+', '-', '*', '/'].includes(ch);

  // Evaluate expression safely-ish
  function evaluateExpression() {
    try {
      // Only allow digits, operators, parentheses, dot, spaces
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      if (!sanitized.trim()) return updateDisplay();

      const result = Function('"use strict"; return (' + sanitized + ')')();
      if (typeof result === 'number' && Number.isFinite(result)) {
        // Format result nicely
        expression = Number.isInteger(result) ? String(result) : String(parseFloat(result.toPrecision(12)));
        updateDisplay();
      } else {
        throw new Error('Invalid result');
      }
    } catch (err) {
      display.textContent = 'Error';
      expression = '';
    }
  }

  // Handle button clicks
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.textContent.trim();

      if (val === 'Clear') {
        clearAll();
        return;
      }

      if (val === '=') {
        evaluateExpression();
        return;
      }

      if (!isNaN(val) || val === '.') {
        // Prevent multiple dots in one number
        if (val === '.') {
          const lastOpIndex = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/')
          );
          const currentNumber = expression.slice(lastOpIndex + 1);
          if (currentNumber.includes('.')) return; // already has dot
          if (currentNumber === '') expression += '0';
        }
        expression += val;
        updateDisplay();
        return;
      }

      if (isOperator(val)) {
        // Prevent operator at start except '-'
        if (expression === '' && val !== '-') return;
        // Replace last operator if consecutive
        const lastChar = expression.slice(-1);
        if (isOperator(lastChar)) {
          expression = expression.slice(0, -1) + val;
        } else {
          expression += val;
        }
        updateDisplay();
        return;
      }
    });
  });

  // Initialize display
  updateDisplay();
});
