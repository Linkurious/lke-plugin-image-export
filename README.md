# Image export plugin for Linkurious Enterprise

![Screenshot](./images/screenshot.png)

This plugin allows you to export the visualization with better quality and more settings.

## Table of contents

- [Configuarion](#configuration)
- [Export settings](#export-settings)
- [Snapping](#snapping)
- [Full-size export](#full-size-export)
- [Pre-defined formats](#pre-defined-formats)
- [Background Export](#background-export)
- [Choosing format](#choosing-format)
- [Annotations](#annotations)

## Configuration

Plugin is available through a custom action:

1.  In visualization menu, select "Manage custom actions..."
2.  "New custom action"
3.  Custom action name: "Save as image"
4.  URL template is `{{baseURL}}plugins/image-export/?id={{visualization}}&key={{sourceKey}}`. This will allow the custom action to access the visualization.
5.  You can also share the custom action thus making it available for other users of Linkurious Enterprise in your company.
6.  "Save"

Now, once the visualization is saved, you will have a custom action in your context menu that will allow you to export the visualization as an image. To call it, right-click anywhere on your visualization, "Custom actions" &rarr; "Save as image".

![Custom action](./images/custom-action.png)

This will open the plugin in another tab in your browser. In the plugin, you can select the format and the size of the image. Available formats are <abbr title="Scalable Vector Graphics">SVG</abbr> and <abbr title="Portable Network Graphics">PNG</abbr>.

## Export settings

- **Text:**
  - **visibility** - you can show/hide all the node and edge captions
  - **scaling** - you can scale all the captions to be 1-300% of the original size
  - **overlap** - you can chose to disable the automatic overlap removal policy for the captions and arrange them manually in such a way that they are readable
- **Background:** You can chose to export the background of the visualization or to export it with a transparent background in order to put it on your own custom background.
- **Export size:**
  - **Full-size:** You can chose to export the whole graph at the detalization level that you are currently seeing on the screen.
  - **Pre-defined sizes** - you can also go for the pre-defined document sizes (for instance, for printing) and _fit_ your visualization into it, using panning and zooming. If you are aiming at embedding your exported images into presentations, please refer to the [pre-defined PowerPoint slide sizes](https://support.microsoft.com/en-us/office/change-the-size-of-your-slides-040a811c-be43-40b9-8d04-0de5ed79987e) - for the modern system that would be `Widescreen`. For printing, you have a selection of popular document sizes, from A3 to letterhead. It is preferable to use SVG file format for printing, as it is vectorial and will produce higher quality prints. Note that if you select the pre-defined document size, the parts of the graph that are not fitting into it, will be clipped.

## Snapping

Snapping allows you to manually align each node linearly with other nodes in the visualization.

## Full-size export

It's the default mode of the plugin. In this mode, the visualization will be exported at the current zoom level and detalization level, so nodes, edges and texts will have exactly the same size as you can see on your screen.

![full-size export](./images/full-size.gif)

The indicator in the settings panel will show the calculated size of the exported image. From here you can continue to the preview, where you will be able to check the details of the resulting image.

![Full-size export preview](./images/full-size-preview.png)

## Pre-defined formats

You can also go for pre-defined export document sizes from the list:

![Pre-defined export format](./images/predefined-format.png)

After you chose the document size, the plugin will calculate the size of the exported image and show it in the settings panel. It will also show the format boundaries on the screen so that you could fit the whole graph or a part of it into the document size.

![Size-fitting](./images/size-fitting.gif)

## Background Export

You can chose whether or not to include the background color defined in Linkurious Enterprise settings into the exported file. The selector for that is located on the bottom of the preview window.

![Background select](./images/background.gif)

## Choosing format

Currently the plugin offers two formats: SVG and PNG. You can choose the format by clicking on the arrow next to the format name in the preview window.

![Format selector](./images/format-select.png)

- <abbr title="Scalable Vector Graphics">SVG</abbr> - this is the vector format that would offer the best quality and file size for printing and sharing on the web. It has all the fonts and images embedded into the document. It is also editable by the popular vector graphics applications such as [Adobe Illustrator](https://www.adobe.com/), [Inkscape](https://inkscape.org/) and lots of others. They can also be resized and embedded into the presentations and documents without any quality loss.
- <abbr title="Portable Network Graphics">PNG</abbr> - this is the raster format and its advantage is that it can be viewed by more applications, such as default image viewers on any operating system. Resizing the PNG documents will cause blurriness and degraded quality.

## Annotations

You can add annotations to the exported image. To do that, you need to select a type of annotation from the annotations bar

<img src="./images/annotations-bar.png" alt="Annotations bar" />

Currently, the plugin supports the following types of annotations:

- Text box
- Arrow

### Adding text boxes

To add a text box, click on the "Text box" button in the annotations bar. Then, draw a rectangle on the screen. The text box will be added to the image.

<img src="./images/adding-text-annotation.gif" alt="Adding text annotation" />

You can change the text in the text box by clicking and focusing on the text box. You can also change the size of the text box by dragging the corners of the rectangle, or move it around by grabbing the box by one of the sides. You can also delete the text box by selecting it and pressing the <kbd>Backspace</kbd> key.

<img src="./images/editing-text-annotation.gif" alt="Text box editing" />

You can change the style of the text, including the font, font size, font color, and background color. To do that, click on the text box and select the "Text" tab in the settings panel.

### Adding arrows

To add an arrow, click on the "Arrow" button in the annotations bar. Then, click on the start point of the arrow and drag it to the end point. The arrow will be added to the image.

<img src="./images/adding-arrow-annotation.gif" alt="Adding arrow annotation" />

You can edit the arrow by clicking on it and selecting the "Arrow" tab in the settings panel. You can change the color, the width, and the direction of an arrow.

### Combining text boxes and arrows

You can combine and connect text boxes with arrows and lines. For that, you need to drag one of the endpoints of the line close to the text box. The line will snap to the text box and will be connected to it. Now you can move the text box around and the line will follow it.

<img src="./images/connect-arrow-text.gif" alt="Combining annotations" />
