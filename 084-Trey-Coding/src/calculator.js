import fs from "fs";
// Import safe-eval
import safeEval from "safe-eval";

export default function calculator_callback(request, response) {
    const expression = request.query?.expressionChooser;
    let content = "";

    if (expression) {
        try {
            content = fs.readFileSync("public/calculator.html", "utf8");
            // Replace eval with safe-eval;
            const answer = safeEval(expression);
            content = content.replace("&gt;", "&gt; " + answer)
            response.send(content);
        } catch (e) {
            content = content.replace("&gt;", "&gt; " + e)
            response.send(content);
        }
    } else {
        try {
            content = fs.readFileSync("public/calculator.html", "utf8");
        } catch (e) {
            console.log("Error:", e.stack);
        }
        response.send(content);
    }
}
