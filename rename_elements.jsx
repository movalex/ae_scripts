// After Effects Script to Rename Selected Elements
{
    var scriptName = "Rename Selected Elements";

    function showRenameUI() {
        var settingsSection = "RenameScript";

        // Initialize settings if not already set
        if (!app.settings.haveSetting(settingsSection, "FindText")) {
            app.settings.saveSetting(settingsSection, "FindText", "");
        }
        if (!app.settings.haveSetting(settingsSection, "ReplaceText")) {
            app.settings.saveSetting(settingsSection, "ReplaceText", "");
        }
        if (!app.settings.haveSetting(settingsSection, "ProcessSelected")) {
            app.settings.saveSetting(settingsSection, "ProcessSelected", "false");
        }

        var savedFindText = app.settings.getSetting(settingsSection, "FindText");
        var savedReplaceText = app.settings.getSetting(settingsSection, "ReplaceText");
        var savedProcessSelected = app.settings.getSetting(settingsSection, "ProcessSelected") === "true";

        var myWin = new Window("palette", scriptName, undefined, {resizeable:true});
        myWin.orientation = "column";

        var findGroup = myWin.add("group");
        findGroup.add("statictext", undefined, "Find:");
        var findText = findGroup.add("edittext", undefined, savedFindText);
        findText.characters = 20;

        var replaceGroup = myWin.add("group");
        replaceGroup.add("statictext", undefined, "Replace:");
        var replaceText = replaceGroup.add("edittext", undefined, savedReplaceText);
        replaceText.characters = 20;

        var processSelectedOnly = myWin.add("checkbox", undefined, "Process only selected items");
        processSelectedOnly.value = savedProcessSelected;

        var buttonGroup = myWin.add("group");
        buttonGroup.alignment = "center";
        var applyButton = buttonGroup.add("button", undefined, "Apply");
        var cancelButton = buttonGroup.add("button", undefined, "Cancel");

        applyButton.onClick = function() {
            var findStr = findText.text;
            var replaceStr = replaceText.text;
            var selectedOnly = processSelectedOnly.value;

            // Save the values
            app.settings.saveSetting(settingsSection, "FindText", findStr);
            app.settings.saveSetting(settingsSection, "ReplaceText", replaceStr);
            app.settings.saveSetting(settingsSection, "ProcessSelected", selectedOnly.toString());

            // Rename the items
            renameItems(findStr, replaceStr, selectedOnly);
            myWin.close();
        }

        cancelButton.onClick = function() {
            myWin.close();
        }

        myWin.center();
        myWin.show();
    }

    function renameItems(findStr, replaceStr, selectedOnly) {
        var proj = app.project;
        if (!proj) {
            alert("Please open a project first.");
            return;
        }

        var items = proj.items;
        app.beginUndoGroup(scriptName);

        for (var i = 1; i <= items.length; i++) {
            var item = items[i];
            if ((selectedOnly && item.selected) || !selectedOnly) {
                if (item.name.indexOf(findStr) !== -1) {
                    item.name = item.name.replace(new RegExp(findStr, 'g'), replaceStr);
                }
            }
        }

        app.endUndoGroup();
    }

    showRenameUI();
}
