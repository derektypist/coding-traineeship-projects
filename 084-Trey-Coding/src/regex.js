import safe from "safe-regex";
import fs from "fs";

export default function regex_callback(request, response) {
    const regex = request.query?.regex;
    let content = "";

    if (regex) {
        content = fs.readFileSync("public/regex.html", "utf8");
        // Convert exec to execFile
        const result = safe(regex) ? "SAFE" : "NOT SAFE";
        content = content.replace("&gt;", "&gt; <code style=\"color: darkred;\">" + regex + "</code> is " + result);
        response.send(content);
    } else {
        try {
            content = fs.readFileSync("public/regex.html", "utf8");
        } catch (e) {
            console.log("Error:", e.stack);
        }
        response.send(content);
    }
}
