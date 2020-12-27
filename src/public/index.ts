import {LKOgma} from 'ogma-helper';
import {IOgmaConfig, PopulatedVisualization} from "@linkurious/rest-client";

declare global {
  interface Window {
    ogma: LKOgma;
  }
}

class LKEImageExport {
  public ogmaConfiguration!: IOgmaConfig;
  public ogma!: LKOgma;
  public visualizationConfiguration!: PopulatedVisualization | undefined;
  public showCaptions: boolean = true;

  constructor() {

  }

  public async init() {
    this.ogmaConfiguration = await LKEImageExport.getOgmaConfiguration();
    this.visualizationConfiguration = await LKEImageExport.getVizConfiguration();

    this.ogma = new LKOgma(this.ogmaConfiguration);
    this.ogma.setContainer('graph-container');
    this.ogma.initVisualization(this.visualizationConfiguration as PopulatedVisualization);
    document.getElementById('show-captions__checkbox')?.addEventListener('change', this.updateShowCaptionsValue.bind(this))
    this.ogma.view.locateGraph({duration: 750});
    // init button events
    document.getElementById('export-btn')?.addEventListener('click', this.exportGraph.bind(this))
  }

  public updateShowCaptionsValue(event: Event) {
    console.log(event)
    this.showCaptions = !this.showCaptions;
  }

  public exportGraph() {
    console.log('clicked')
    this.ogma.export.png({
      clip: true,
      images: true,
      legend: true,
      texts: this.showCaptions
    })

  }

  public static makeRequest(verb: string = 'GET', url: string, body?: unknown): Promise<unknown> {
    const xmlHttp = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xmlHttp.onreadystatechange = () => {
        // Only run if the request is complete
        if (xmlHttp.readyState !== 4) {
          return;
        }
        // Process the response
        if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
          // If successful
          resolve(xmlHttp);
        } else {
          // If failed
          reject({
            status: xmlHttp.status,
            statusText: xmlHttp.statusText,
            body: JSON.parse(xmlHttp.response).body.error
          });
        }
      };
      xmlHttp.open(verb, url);
      xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xmlHttp.send(JSON.stringify(body));
    });
  }


  /**
   * make a request to get ogma configuration
   * @returns {Promise<void>}
   */
  public static async getOgmaConfiguration(): Promise<IOgmaConfig> {
    try {
      const result: any = await LKEImageExport.makeRequest(
        'GET',
        `api/getOgmaConfiguration`,
      );
      return JSON.parse(result.response) as IOgmaConfig;
    } catch (e) {
      console.error(e);
      return {}
    }
  }

  /**
   * make a request to get viz configuration
   * @returns {Promise<void>}
   */
  public static async getVizConfiguration(): Promise<PopulatedVisualization | undefined> {
    try {
      const result: any = await LKEImageExport.makeRequest(
        'GET',
        `api/getVisualizationConfiguration/20&0b12b5c7`,
      );
      return JSON.parse(result.response) as PopulatedVisualization;
    } catch (e) {
      console.error(e);
      return;

    }
  }

}

const ImageExport = new LKEImageExport();

async function main() {
  await ImageExport.init();
  window.ogma = ImageExport.ogma;
}


main();
