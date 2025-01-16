// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import {
  base64ToUint8Array,
  DataId,
  DataRef,
  Rivet,
  type ChartNode,
  type EditorDefinition,
  type ImageNode,
  type Inputs,
  type InternalProcessContext,
  type MarkdownNodeBodySpec,
  type NodeConnection,
  type NodeId,
  type NodeInputDefinition,
  type NodeOutputDefinition,
  type NodeUIData,
  type Outputs,
  type PluginNodeImpl,
  type PortId,
  type Project,
} from "../../node_modules/@ironclad/rivet-core/dist/types";


// import { type Rivet } from '@ironclad/rivet-core';
// This defines your new type of node.
export type MediaPluginNode = ChartNode<
  "mediaPlugin",
  MediaPluginNodeData
>;

// This defines the data that your new node will store.
export type MediaPluginNodeData = {
  data?: DataRef;
  useDataInput: boolean;
  mediaType: 'image/png' | 'image/jpeg' | 'image/gif';
  useMediaTypeInput: boolean;
  // dt: string;
  // sk: string;
  // image:HTMLImageElement
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  // useSomeDataInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function mediaPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const MediaPluginNodeImpl: PluginNodeImpl<MediaPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): MediaPluginNode {
      const node: MediaPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),
        data: {
          useDataInput: false,
          mediaType: 'image/png',
          useMediaTypeInput: false,
        },
        // This is the default data that your node will store
        // data: {
        //   data:{
        //     refId: rivet.newId<DataId>(),
        //     // type: "binary",
        //   }

        //   // someData: "about:blank",
        //   // SK: "",
        //   // image: new Image()
        // },

        // This is the default title of your node.
        title: "Media",

        // This must match the type of your node.
        type: "mediaPlugin",

        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200,
          
        },
      };
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: MediaPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      // if (data.useSomeDataInput) {
      //   inputs.push({
      //     id: "someData" as PortId,
      //     dataType: "string",
      //     title: "Some Data",
      //   });
        // inputs.push({
        //   id: "f" as PortId,
        //   dataType: "binary",
        //   title: "File",
        // });
      // }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: MediaPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        // {
        //   id: "someData" as PortId,
        //   dataType: "string",
        //   title: "Some Data",
        // },
        // {
        //   id: "SK" as PortId,
        //   dataType: "binary",
        //   title: "Secret Key",
        // },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Media",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Media Plugin Node",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: MediaPluginNodeData
    ): EditorDefinition<MediaPluginNode>[] {
      console.log(_data)
      return [
        {
          type: "fileBrowser",
          dataKey: "data",
          mediaTypeDataKey: "mediaType",
          useInputToggleDataKey: "useDataInput",
          label: "File Path",
        },
        // {
        //   type: "string",
        //   dataKey: "someData",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Some Data",
        // },
        // {
        //   type: "string",
        //   dataKey: "SK",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Secret Key",
        // },
      
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: MediaPluginNodeData,
      c:any
    ): string | MarkdownNodeBodySpec | MarkdownNodeBodySpec[] | undefined {


      let _context = c as InternalProcessContext;
      // console.log(_context)
      // console.log(data.data?.refId)
            // const someData = rivet.getInputOrData(
            //   data,
            //   inputData,
            //   "SK",
            //   "object"
            // );
            // _context.project.
            // let someData = {} as any;
            // console.log("bin",someData)
            // let ref = data.someData["refId"] as string;
            // let ref =  (data as Record<string, string>)
            // console.log("ref",ref)
            // console.log(_context.project)
            //  const x =  (_context.project.data as Record<string, string>)[data.data?.refId as string]  ;
            // // console.log("x",base64ToUint8Array(x))
            // console.log("x",x)
            const iframeHeight = window.innerHeight/2;
            return ({
              type: "markdown",
              text: `<iframe id="asdf" 
              onload="try {
                  // const doc = this.contentDocument || this.contentWindow.document;
                  // console.log(getElementById('asdf').src);
                  // console.log(this.getElementById('iframe').contentWindow.document.body.scrollHeight);
                  this.style.height = 500 + 'px';
                  //  console.log(this.height =1000);
                  //  console.log(doc.documentElement.scrollHeight);
               } catch (e) {
                   console.error('Unable to access iframe content:', e);
               }"
              frameborder="0"  
              width="100%" 
           
              />
              `
            });

            
      // return rivet.dedent`
      //   <div>
      //   Media Plugin Node
      //   Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      // `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: MediaPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {


      // let data: Uint8Array;

      // if (this.chartNode.data.useDataInput) {
      //   data = expectType(inputData['data' as PortId], 'binary');
      // } else {
      const dataRef = data.data?.refId as string;
      let d = _context.project.data as Record<string, string>;
      console.log("d",d[dataRef])
      console.log(data.data?.refId)
      
        // if (!dataRef) {
        //   throw new Error('No data ref');
        // }
  
        // const encodedData = _context.project.data?.[dataRef] as string;
        const encodedData = (_context.project.data as Record<string, string>)[dataRef]
        // if (!encodedData) {
        //   throw new Error(`No data at ref ${dataRef}`);
        // }
  
      //   data = base64ToUint8Array(encodedData);
      // }
  
      // const mediaType = this.chartNode.data.useMediaTypeInput
      //   ? expectType(inputData['mediaType' as PortId], 'string')
      //   : this.chartNode.data.mediaType;

      // const someData = rivet.getInputOrData(
      //   data,
      //   inputData,
      //   "SK",
      //   "object"
      // );
      // console.log(someData)
      // let ref = someData["refId"] as string;
      // const ref = data.data?.refId as string;
      // let x =  (_context.project.data as Record<string, string>)[ref]  ;
      // console.log("x",base64ToUint8Array(x))
      // const encodedData = _context.project.data?.[someData] as string;
      const result = await fetch("https://jsonplaceholder.typicode.com/posts" )
     
      return {
        ["image" as PortId]: {
          type:"string",
          value:"<img>test</img>",
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const mediaPluginNode = rivet.pluginNodeDefinition(
    MediaPluginNodeImpl,
    "Media Plugin"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return mediaPluginNode;
}
