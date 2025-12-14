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
        const value = btn.textContent;

        // ===== Numbers =====
        if (!isNaN(value)) {
            expression += value;
            updateDisplay();
            return;
        }

        // ===== Decimal =====
        if (value === ".") {
            // prevent multiple dots in same number
            const lastNumber = expression.split(/[+\-*/]/).pop();
            if (!lastNumber.includes(".")) {
                expression += ".";
                updateDisplay();
            }
            return;
        }

        // ===== AC =====
        if (value === "AC") {
            expression = "";
            updateDisplay();
            return;
        }

        // ===== +/- =====
        if (value === "+/-") {
            const match = expression.match(/(-?\d*\.?\d+)$/);
            if (match) {
                const toggled = (-parseFloat(match[0])).toString();
                expression = expression.replace(/(-?\d*\.?\d+)$/, toggled);
                updateDisplay();
            }
            return;
        }

        // ===== % =====
        if (value === "%") {
            const match = expression.match(/(-?\d*\.?\d+)$/);
            if (match) {
                const percent = (parseFloat(match[0]) / 100).toString();
                expression = expression.replace(/(-?\d*\.?\d+)$/, percent);
                updateDisplay();
            }
            return;
        }

        // ===== Operators =====
        if (["+", "-", "*", "/"].includes(value)) {
            if (expression === "") return;
            if (/[+\-*/]$/.test(expression)) return;

            expression += value;
            updateDisplay();
            return;
        }

        // ===== Equals =====
        if (value === "=") {
            try {
                const result = eval(expression);
                history.push(`${expression} = ${result}`);
                updateHistory();

                expression = result.toString();
                display.textContent = expression;
            } catch {
                display.textContent = "Error";
                expression = "";
            }
        }
    });
});

// ===== KEYBOARD & NUMPAD SUPPORT =====

// focus display when clicked
display.addEventListener("click", () => {
    display.focus();
});

// keyboard input
document.addEventListener("keydown", (e) => {
    const key = e.key;

    // numbers (top row + numpad)
    if (!isNaN(key)) {
        expression += key;
        updateDisplay();
        return;
    }

    // operators
    if (["+", "-", "*", "/"].includes(key)) {
        if (expression === "") return;
        if (/[+\-*/]$/.test(expression)) return;

        expression += key;
        updateDisplay();
        return;
    }

    // decimal
    if (key === ".") {
        const last = expression.split(/[+\-*/]/).pop();
        if (!last.includes(".")) {
            expression += ".";
            updateDisplay();
        }
        return;
    }

    // enter (=)
    if (key === "Enter" || key === "=") {
        try {
            const result = eval(expression);
            history.push(`${expression} = ${result}`);
            updateHistory();

            expression = result.toString();
            updateDisplay();
        } catch {
            display.textContent = "Error";
            expression = "";
        }
        return;
    }

    // backspace
    if (key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay();
        return;
    }

    // clear
    if (key === "Escape") {
        expression = "";
        updateDisplay();
    }
});
