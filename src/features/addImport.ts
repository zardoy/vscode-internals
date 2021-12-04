import vscode from 'vscode'
import { registerExtensionCommand } from 'vscode-framework'

export const registerAddImport = () => {
    registerExtensionCommand('addImport', async () => {
        // for TS files only
        // TODO this command will be removed from here in favor of TS plugin
        const editor = vscode.window.activeTextEditor
        if (editor === undefined) return
        // const nextImportIndex = /^(?!import)/m.exec(editor.document.getText())?.index ?? 0
        let nextImportLine = 1
        let lineIndex = 0
        for (const line of editor.document.getText().split('\n')) {
            lineIndex++
            if (line.startsWith('import')) continue
            nextImportLine = lineIndex - 1
            break
        }

        const currentPos = editor.selection.start
        await editor.insertSnippet(new vscode.SnippetString("import { $2 } from '$1'\n"), new vscode.Position(nextImportLine, 0))
        const { dispose } = vscode.window.onDidChangeTextEditorSelection(({ selections }) => {
            const currentLine = selections[0]!.start.line
            if (currentLine !== nextImportLine) dispose()

            if (currentLine <= nextImportLine) return
            // looses selections and mutl-selections
            editor.selection = new vscode.Selection(currentPos.translate(1), currentPos.translate(1))
        })
    })
}