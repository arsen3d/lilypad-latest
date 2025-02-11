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
} from "../../node_modules/@ironclad/rivet-core/dist/types";

 
// This defines your new type of node.
export type OncologistAgentPluginNode = ChartNode<
  "oncologistAgentPlugin",
  OncologistAgentPluginNodeData
>;

// This defines the data that your new node will store.
export type OncologistAgentPluginNodeData = {
  prompt: string;
  model: "DeepSeek 70B" | "Falcon3 7B" | "DeepSeek 671B"; // Dropdown options
  inputData: string;
  useSomeDataInput?: boolean;
};

export function oncologistAgentPluginNode(rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const OncologistAgentPluginNodeImpl: PluginNodeImpl<OncologistAgentPluginNode> = {
    // This should create a new instance of your node type from scratch.
    create(): OncologistAgentPluginNode {
      const node: OncologistAgentPluginNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

        // This is the default data that your node will store
        data: {
          prompt: `You are an expert oncology researcher who specializes in designing new precision immuno therapy compounds for oncology. You will be given a paragraph that should contain a description of an immuno therapy related molecule/antibody/binder, and your job is two fold:
- Produce a prompt to be used with a text-to-protein model to produce a PDB file from a scientifically rigorous description of the molecule.
- Produce a lab report that includes: High level summary of background and impact of molecule, description of known interactomics between the subject molecule and other known onco bio-molecules, any information that would be useful to a practicing oncologist or wet lab scientist in using or prescribing the molecule or a derived molecule with a patient.
                  `,
          model: "DeepSeek 70B",
          inputData: "Paper titles + abstracts + topic-target",
          useSomeDataInput: true,
        },

        // This is the default title of your node.
        title: "Oncologist Agent",

        // This must match the type of your node.
        type: "oncologistAgentPlugin",

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
      data: OncologistAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData" as PortId,
          dataType: "string",
          title: "Selected paragraphs",
        });
        // inputs.push({
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: OncologistAgentPluginNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "someData" as PortId,
          dataType: "string",
          title: "PDB-generation-prompt + Report",
        },
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "Oncologist Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Oncologist Agent",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: OncologistAgentPluginNodeData
    ): EditorDefinition<OncologistAgentPluginNode>[] {
      return [
        {
          type: "string",
          dataKey: "prompt",
          // useInputToggleDataKey: "useSomeDataInput",
          label: "Prompt",
        },
        {
          type: "dropdown",
          dataKey: "model",
          // useInputToggleDataKey: "useSomeDataInput",
          label: "Model",
          options: [
            { value: "DeepSeek 70B", label: "DeepSeek 70B" },
            { value: "Falcon3 7B", label: "Falcon3 7B" },
            { value: "DeepSeek 671B", label: "DeepSeek 671B" },
          ],
        },
        {
          type: "string",
          dataKey: "inputData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Input:",
        },
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
      data: OncologistAgentPluginNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
      Model: ${data.model}\n
      Input: ${data.useSomeDataInput?"<<Selected paragraphs>>":data.inputData}\n
      Output: <<PDB-generation-prompt + Lab report on molecule>>\n
      Prompt: ${data.prompt}\n
    `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: OncologistAgentPluginNodeData,
      inputData: Inputs,
      _context: InternalProcessContext
    ): Promise<Outputs> {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "inputData",
        "string"
      );

     const result = await fetch("https://jsonplaceholder.typicode.com/posts" )
     
      return {
        ["someData" as PortId]: {
          type: "string",
          value: await result.text(),
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const oncologistAgentPluginNode = rivet.pluginNodeDefinition(
    OncologistAgentPluginNodeImpl,
    "Search Agent"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return oncologistAgentPluginNode;
}
