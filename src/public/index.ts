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
  private _captionSize: number = 14;
  // type is StyleRule<LkNodeData, LkEdgeData>: need to export it from ogma-helper
  private captionsSizeRule!: any;

  constructor() {

  }

  public async init() {
    this.ogmaConfiguration = await LKEImageExport.getOgmaConfiguration();
    this.visualizationConfiguration = await LKEImageExport.getVizConfiguration();

    this.ogma = new LKOgma( {
      ...this.ogmaConfiguration, options: {...this.ogmaConfiguration.options, backgroundColor: "rgba(240, 240, 240)"}
    } );
    this.ogma.setContainer( 'graph-container' );
    this.ogma.initVisualization( this.visualizationConfiguration as PopulatedVisualization );
    this.ogma.getNodes().setAttribute( 'layoutable', true );
    this.ogma.view.locateGraph( {duration: 750} );
    this.initUIElements();
  }

  public get captionSize() {
    return this._captionSize
  }

  public set captionSize(size: number) {
    this._captionSize = size
  }

  private initUIElements() {
    document.getElementById( 'show-captions__checkbox' )?.addEventListener( 'change', this.updateShowCaptionsValue.bind( this ) );
    document.getElementById( 'caption-size' )?.addEventListener( 'change', this.updateCaptionSize.bind( this ) );
    document.getElementById( 'export-btn' )?.addEventListener( 'click', this.exportGraph.bind( this ) );
  }

  public updateShowCaptionsValue() {
    this.showCaptions = !this.showCaptions;
    this.ogma.styles.setEdgeTextsVisibility( this.showCaptions );
    this.ogma.styles.setNodeTextsVisibility( this.showCaptions );
  }

  public updateCaptionSize(event: Event) {
    this.captionSize = parseInt( (event?.target as any).value );
    if (this.captionsSizeRule === undefined) {
      this.captionsSizeRule = this.ogma.styles.addRule( {
        nodeAttributes: {
          text: {
            size: () => {
              return this.captionSize;
            }
          }
        },
        edgeAttributes: {
          text: {
            size: () => {
              return this.captionSize;
            }
          }
        },
      } );
    } else {
      this.captionsSizeRule.refresh()
    }

  }

  public exportGraph() {
    this.ogma.export.png( {
      clip: true,
      images: true,
      legend: true,
      texts: this.showCaptions
    } )

  }

  public static makeRequest(verb: string = 'GET', url: string, body?: unknown): Promise<unknown> {
    const xmlHttp = new XMLHttpRequest();
    return new Promise( (resolve, reject) => {
      xmlHttp.onreadystatechange = () => {
        // Only run if the request is complete
        if (xmlHttp.readyState !== 4) {
          return;
        }
        // Process the response
        if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
          // If successful
          resolve( xmlHttp );
        } else {
          // If failed
          reject( {
            status: xmlHttp.status,
            statusText: xmlHttp.statusText,
            body: JSON.parse( xmlHttp.response ).body.error
          } );
        }
      };
      xmlHttp.open( verb, url );
      xmlHttp.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
      xmlHttp.send( JSON.stringify( body ) );
    } );
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
      return JSON.parse( result.response ) as IOgmaConfig;
    } catch (e) {
      console.error( e );
      return {}
    }
  }

  /**
   * make a request to get viz configuration
   * @returns {Promise<void>}
   */
  public static async getVizConfiguration(): Promise<PopulatedVisualization | undefined> {
    try {
      const urlParams = LKEImageExport.getURLParams();
      const result: any = await LKEImageExport.makeRequest(
        'GET',
        `api/getVisualizationConfiguration/${'id=' + urlParams.id}&${'sourceKey=' + urlParams.sourceKey}`,
      );
      return JSON.parse( result.response ) as PopulatedVisualization;
    } catch (e) {
      console.error( e );
      return;

    }
  }

  /**
   * get url params
   */
  public static getURLParams(): {[key: string]: string} {
    const url = location.search;
    const query = url.substr( 1 );
    const result: {[key: string]: string} = {};
    query.split( '&' ).forEach( (param) => {
      const item = param.split( '=' );
      result[item[0]] = item[1];
    } );
    return result;
  }

}

const ImageExport = new LKEImageExport();

async function main() {
  await ImageExport.init();
  window.ogma = ImageExport.ogma;
}


main();
