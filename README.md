# Image export plugin for Linkurious Enterprise

![Screenshot](./images/screenshot.png)

This plugin allows you to export the visualization with better quality and more settings.

## Configuration

Plugin is avalailable through a custom action:

1.  In visualization menu, select "Manage custom actions..."
2.  "New custom action"
3.  Custom action name: "Save as image"
4.  URL template is `{{baseURL}}plugins/custom-image-export/?id={{visualization}}&sourceKey={{sourceKey}}`. This will allow the custom action to access the visualization.
5.  You can also share the custom action thus making it avalailable for other users of Linkurious Enterprise in your company.
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
  - **Pre-defined sizes** - you can also go for the pre-defined document sizes (for instance, for printing) and _fit_ your visualisation into it, using panning and zooming. You have a selection of popular document sizes, from A3 to letterhead. Note that if you select the pre-defined document size, the parts of the graph that are not fitting into it, will be clipped.
