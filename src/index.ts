import { LKOgma } from "@linkurious/ogma-linkurious-parser";
import { IOgmaConfig, PopulatedVisualization } from "@linkurious/rest-client";
import xhr from "axios";

async function getOgmaConfiguration(): Promise<IOgmaConfig> {
  try {
    return (await xhr.get<IOgmaConfig>(`api/getOgmaConfiguration`)).data;
  } catch (e) {
    console.error(e);
    return {};
  }
}

/**
 * make a request to get viz configuration
 * @returns {Promise<void>}
 */
async function getVizConfiguration(): Promise<
  PopulatedVisualization | undefined
> {
  try {
    const params = getURLParams();
    return (
      await xhr.get<PopulatedVisualization>(
        `api/getVisualizationConfiguration/`,
        { params }
      )
    ).data;
  } catch (e) {
    console.error(e);
    return;
  }
}

/**
 * get url params
 */
function getURLParams(): { [key: string]: string } {
  const url = location.search;
  const query = url.substr(1);
  const result: { [key: string]: string } = {};
  query.split("&").forEach((param) => {
    const item = param.split("=");
    result[item[0]] = item[1];
  });
  return result;
}

export default class {
  public ogmaConfiguration!: IOgmaConfig;
  public ogma!: LKOgma;
  public visualizationConfiguration!: PopulatedVisualization | undefined;
  public showCaptions: boolean = true;
  private _captionSize: number = 14;
  // type is StyleRule<LkNodeData, LkEdgeData>: need to export it from ogma-helper
  private captionsSizeRule!: any;

  constructor() {}

  public async init() {
    this.ogmaConfiguration = await getOgmaConfiguration();
    this.visualizationConfiguration = await getVizConfiguration();

    this.ogma = new LKOgma({
      ...this.ogmaConfiguration,
      options: {
        ...this.ogmaConfiguration.options,
        backgroundColor: "rgba(240, 240, 240)",
      },
    });
    this.ogma.setContainer("graph-container");
    this.ogma.initVisualization(
      this.visualizationConfiguration as PopulatedVisualization
    );
    this.ogma.getNodes().setAttribute("layoutable", true);
    this.ogma.view.locateGraph({ duration: 750 });
    this.initUIElements();
  }

  public get captionSize() {
    return this._captionSize;
  }

  public set captionSize(size: number) {
    this._captionSize = size;
  }

  private initUIElements() {
    document
      .getElementById("show-captions__checkbox")
      ?.addEventListener("change", this.updateShowCaptionsValue.bind(this));
    document
      .getElementById("caption-size")
      ?.addEventListener("change", this.updateCaptionSize.bind(this));
    document
      .getElementById("export-btn")
      ?.addEventListener("click", this.exportGraph.bind(this));
    window.addEventListener("resize", this.forceOgmaViewResize.bind(this));
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM fully loaded and parsed");
    });
  }

  public forceOgmaViewResize() {
    this.ogma.view.forceResize();
  }

  public updateShowCaptionsValue() {
    this.showCaptions = !this.showCaptions;
    this.ogma.styles.setEdgeTextsVisibility(this.showCaptions);
    this.ogma.styles.setNodeTextsVisibility(this.showCaptions);
    // @ts-ignore
    document.getElementById("caption-size")?.disabled = !this.showCaptions;
  }

  public updateCaptionSize(event: Event) {
    this.captionSize = parseInt((event?.target as any).value);
    if (this.captionsSizeRule === undefined) {
      this.captionsSizeRule = this.ogma.styles.addRule({
        nodeAttributes: {
          text: {
            size: () => {
              return this.captionSize;
            },
          },
        },
        edgeAttributes: {
          text: {
            size: () => {
              return this.captionSize;
            },
          },
        },
      });
    } else {
      this.captionsSizeRule.refresh();
    }
  }

  public exportGraph() {
    this.ogma.export.png({
      clip: true,
      images: true,
      legend: true,
      texts: this.showCaptions,
      background: "rgba(240, 240, 240)",
    });
  }

  /**
   * make a request to get ogma configuration
   * @returns {Promise<void>}
   */
}
