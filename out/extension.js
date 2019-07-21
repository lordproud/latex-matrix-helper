"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    let provider1 = vscode.languages.registerCompletionItemProvider([
        { scheme: 'file', language: 'latex' },
        { scheme: 'file', language: 'tex' }
    ], {
        provideCompletionItems(document, position, token, context) {
            let linePrefix = document.lineAt(position).text.substr(0, position.character);
            const rgxp = /(qm|bm|Bm|vm|pm|mm|m)(\d+)(x)(\d+)/;
            const res = linePrefix.match(rgxp);
            if (!res) {
                return undefined;
            }
            const [row, column] = [Number(res[2]), Number(res[4])];
            //Create Matrix n m without \begin{} and \end{}
            const createNumXNum = (row, column) => {
                const arr = Array.from({ length: row * column }, (_, k) => k + 1);
                return arr.reduce((acc, v) => {
                    if (v === arr.length) {
                        return acc + '$' + v + '\n';
                    }
                    else if (v % column !== 0) {
                        return acc + '$' + v + ' & ';
                    }
                    else {
                        return acc + '$' + v + ' \\\\\\\n';
                    }
                }, '');
            };
            const createMatrix = (typeOfMatrix, matrixStr) => `\\begin{${typeOfMatrix}}\n${matrixStr}\\end{${typeOfMatrix}}`;
            const matrixString = createNumXNum(row, column);
            let template = '';
            if (res[1] === 'm') {
                template = matrixString;
            }
            else if (res[1] === 'mm') {
                template = createMatrix('matrix', matrixString);
            }
            else {
                template = createMatrix(res[1] + 'atrix', matrixString);
            }
            let snippetCompletion = new vscode.CompletionItem(res[0]);
            snippetCompletion.insertText = new vscode.SnippetString(template);
            snippetCompletion.documentation = new vscode.MarkdownString("Insert matrix");
            return [
                snippetCompletion
            ];
        }
    });
    context.subscriptions.push(provider1);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map