const display = document.querySelector(".display_area p");
const buttons = document.querySelectorAll("button");
const historyButton = document.querySelector(".history");

let expression = "";     // Full expression (string)
let history = [];

// Create history popup
const historyBox = document.createElement("div");
historyBox.style.position = "absolute";
historyBox.style.top = "20px";
historyBox.style.right = "20px";
historyBox.style.width = "250px";
historyBox.style.maxHeight = "250px";
historyBox.style.overflowY = "auto";
historyBox.style.background = "white";
historyBox.style.border = "1px solid #ccc";
historyBox.style.borderRadius = "8px";
historyBox.style.padding = "10px";
historyBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
historyBox.style.display = "none";
document.body.appendChild(historyBox);

historyButton.addEventListener("click", () => {
    historyBox.style.display =
        historyBox.style.display === "none" ? "block" : "none";
});

function updateHistory() {
    historyBox.innerHTML = "<h3>History</h3>";
    history.slice().reverse().forEach(entry => {
        const p = document.createElement("p");
        p.textContent = entry;
        historyBox.appendChild(p);
    });
}

function updateDisplay() {
    display.textContent = expression || "0";
}

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        let value = btn.textContent;

        // Number
        if (!isNaN(value)) {
            expression += value;
            updateDisplay();
        }

        // Decimal
        if (value === ".") {
            expression += ".";
            updateDisplay();
        }

        // AC
        if (value === "AC") {
            expression = "";
            updateDisplay();
        }

        // +/- toggle (applies to last number)
        if (value === "+/-") {
            // Find last number in the expression
            let parts = expression.match(/[-+]?\d*\.?\d+$/);

            if (parts) {
                let last = parts[0];
                let toggled = (-parseFloat(last)).toString();
                expression = expression.replace(/[-+]?\d*\.?\d+$/, toggled);
                updateDisplay();
            }
        }

        // Operators
        if (["+", "-", "*", "/"].includes(value)) {
            if (expression === "") return;

            // Avoid double operator input
            if (/[+\-*/]$/.test(expression)) return;

            expression += " " + value + " ";
            updateDisplay();
        }

        // Percentage (applies to last number)
        if (value === "%") {
            let parts = expression.match(/[-+]?\d*\.?\d+$/);

            if (parts) {
                let last = parts[0];
                let percent = (parseFloat(last) / 100).toString();
                expression = expression.replace(/[-+]?\d*\.?\d+$/, percent);
                updateDisplay();
            }
        }

        // "="
        if (value === "=") {
            if (expression.trim() === "") return;

            try {
                let result = eval(expression);

                // Save to history
                history.push(`${expression} = ${result}`);
                updateHistory();

                // Show result
                display.textContent = result;

                // Reset expression to result
                expression = result.toString();
            } catch {
                display.textContent = "Error";
                expression = "";
            }
        }
    });
});
