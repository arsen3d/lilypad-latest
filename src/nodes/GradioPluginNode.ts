// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import type {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";

// This defines your new type of node.
export type GradioPluginNode = ChartNode<
  "gradioPlugin",
  GradioPluginNodeData
>;

// This defines the data that your new node will store.
export type GradioPluginNodeData = {
  someData: string;
  SK: string;
  // It is a good idea to include useXInput fields for any inputs you have, so that
  // the user can toggle whether or not to use an import port for them.
  useSomeDataInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function gradioPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const GradioPluginNodeImpl: PluginNodeImpl<GradioPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): GradioPluginNode {
      const node: GradioPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          SK:""
        },

        // This is the default title of your node.
        title: "Gradio",

        // This must match the type of your node.
        type: "gradioPlugin",

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
      data: GradioPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData" as PortId,
          dataType: "string",
          title: "Some Data",
        });
        inputs.push({
          id: "SK" as PortId,
          dataType: "string",
          title: "Secret Key",
        });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: GradioPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "someData" as PortId,
          dataType: "string",
          title: "Some Data",
        },
        {
          id: "SK" as PortId,
          dataType: "string",
          title: "Secret Key",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Gradio",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: GradioPluginNodeData
    ): EditorDefinition<GradioPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data",
        },
        {
          type: "string",
          dataKey: "SK",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Secret Key",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: GradioPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Example Plugin Node
        Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: GradioPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
    //const result = await fetch("https://jsonplaceholder.typicode.com/posts" )
    const response = await fetch("https://bharat-raghunathan-song-lyrics-classifier.hf.space/call/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: ["Hello!!"],
      }),
    });

    const { event_id } = await response.json();

    const result = await fetch(`https://bharat-raghunathan-song-lyrics-classifier.hf.space/call/predict/${event_id}`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      },
    });
    const text = (await result.text()).replace("data", '"data"');
    const lines = text.split('\n');
    lines.shift();
    const modifiedText = "{" + lines.join('\n') + "}";
    console.log(modifiedText);
    const resultData = JSON.parse(modifiedText);
    const value = resultData.data;
    // const resultText = await result.text();
    // let resultData;
    // try {
    //   resultData = JSON.parse(resultText);
    // } catch (e) {
    //   console.error("Failed to parse JSON:", e);
    //   resultData = { data: resultText };
    // }
    // console.log(resultData);
    // console.log(resultData[0].confidences);
      return {
        ["someData" as PortId]: {
          type: "string",
          value: JSON.stringify(value),
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const gradioPluginNode = rivet.pluginNodeDefinition(
    GradioPluginNodeImpl,
    "Example Plugin"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return gradioPluginNode;
}
