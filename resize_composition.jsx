{
    // Set your desired new dimensions and frame rate
    var newWidth = 1500;
    var newHeight = 1020;
    var newFrameRate = 60;
    var renderSettingsTemplate = "Best Settings"; // Name of your render settings template
    var outputModuleTemplate = "Lossless"; // Name of your output module template
    var outputPath = "~/Desktop/"; // Set your desired output path

    // Function to adjust composition settings
    function adjustCompSettings(comp) {
        comp.width = newWidth;
        comp.height = newHeight;
        comp.frameRate = newFrameRate;

        

        // Adjust keyframe timings for the new frame rate
        // This function is disabled for now
        /*
        for (var l = 1; l <= comp.layers.length; l++) {
            var layer = comp.layers[l];
            var properties = [
                'Position', 'Scale', 'Rotation', 'Opacity', 'Anchor Point',
                'Orientation', 'X Rotation', 'Y Rotation', 'Z Rotation',
                'Mask Path', 'Mask Opacity', 'Mask Feather', 'Mask Expansion',
                'Audio Levels', 'Path', 'Stroke', 'Fill', 'Source Text'
            ];

            for (var p = 0; p < properties.length; p++) {
                var prop = layer.property(properties[p]);
                if (prop && prop.numKeys > 0) {
                    for (var k = 1; k <= prop.numKeys; k++) {
                        var keyTime = prop.keyTime(k);
                        var newKeyTime = keyTime * (comp.frameRate / newFrameRate);
                        prop.setKeyTime(k, newKeyTime);
                    }
                }
            }

            // Iterate over effects
            var effects = layer.property("ADBE Effect Parade");
            if (effects) {
                for (var e = 1; e <= effects.numProperties; e++) {
                    var effect = effects.property(e);
                    for (var ep = 1; ep <= effect.numProperties; ep++) {
                        var effectProp = effect.property(ep);
                        if (effectProp && effectProp.numKeys > 0) {
                            for (var ek = 1; ek <= effectProp.numKeys; ek++) {
                                var effectKeyTime = effectProp.keyTime(ek);
                                var newEffectKeyTime = effectKeyTime * (comp.frameRate / newFrameRate);
                                effectProp.setKeyTime(ek, newEffectKeyTime);
                            }
                        }
                    }
                }
            }
        }
        */
    }

    // Function to resize and adjust composition
    function resizeAndNestComp(originalComp) {
        // Create a new composition with the desired dimensions and frame rate
        var newComp = app.project.items.addComp(originalComp.name + "_Resized", newWidth, newHeight, 1, originalComp.duration, newFrameRate);

        // Add the original composition as a nested layer
        var nestedCompLayer = newComp.layers.add(originalComp);

        // Ensure 100% scale in the resized composition
        nestedCompLayer.transform.scale.setValue([100, 100]);

        // Disable the first layer in each nested composition
        if (originalComp.layers.length > 0) {
            originalComp.layers[1].enabled = false;
        }

        // Respect the render in and out points
        newComp.workAreaStart = originalComp.workAreaStart;
        newComp.workAreaDuration = originalComp.workAreaDuration;

        return newComp;
    }

    // Function to add composition to render queue
    function addToRenderQueue(comp) {
        var renderQueueItem = app.project.renderQueue.items.add(comp);
        renderQueueItem.applyTemplate(renderSettingsTemplate);
        renderQueueItem.outputModule(1).applyTemplate(outputModuleTemplate);

        // Set output file path with comp name and dimensions
        var outputFileName = outputPath + comp.name + "_" + newWidth + "x" + newHeight + ".mov";
        renderQueueItem.outputModule(1).file = new File(outputFileName);
    }

    // Get the currently selected items in the Project panel
    var selectedItems = app.project.selection;

    if (selectedItems.length > 0) {
        app.beginUndoGroup("Resize, Nest, and Add to Render Queue");

        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];

            // Check if the selected item is a composition
            if (item instanceof CompItem) {
                var originalComp = item;
                var newComp = resizeAndNestComp(originalComp);

                // Add the new composition to the render queue
                addToRenderQueue(newComp);
            }
        }

        app.endUndoGroup();
        alert("Selected compositions have been resized, nested, and added to the render queue.");
    } else {
        alert("Please select one or more compositions in the Project panel.");
    }
}
