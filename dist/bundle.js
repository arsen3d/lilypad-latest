// src/nodes/ExamplePluginNode.ts
function examplePluginNode(rivet) {
  const ExamplePluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          SK: ""
        },
        // This is the default title of your node.
        title: "Agent",
        // This must match the type of your node.
        type: "examplePlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Some Data"
        });
        inputs.push({
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Some Data"
        },
        {
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Agent",
        group: "BioMl",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        },
        {
          type: "string",
          dataKey: "SK",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Secret Key"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Example Plugin Node
        Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const examplePluginNode2 = rivet.pluginNodeDefinition(
    ExamplePluginNodeImpl,
    "Example Plugin Node"
  );
  return examplePluginNode2;
}

// src/nodes/CowsayPluginNode.ts
function cowsayPluginNode(rivet) {
  const CowsayPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          SK: ""
        },
        // This is the default title of your node.
        title: "Cowsa",
        // This must match the type of your node.
        type: "cowsayPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Some Data"
        });
        inputs.push({
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Some Data"
        },
        {
          id: "SK",
          dataType: "string",
          title: "Secret Key"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Cowsay !!!",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        },
        {
          type: "string",
          dataKey: "SK",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Secret Key"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Example Plugin Node
        Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const api = _context.getPluginConfig("api") || "no api url. check plugin config";
      const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
      const s = "await result ";
      console.log("1024");
      const { runPythonScript } = await import("../dist/nodeEntry.cjs");
      const output = await runPythonScript(_context, "scriptPath", ["args"]);
      return {
        ["someData"]: {
          type: "string",
          value: "no response 5"
        }
      };
    }
  };
  const cowsayPluginNode2 = rivet.pluginNodeDefinition(
    CowsayPluginNodeImpl,
    "Example Plugin Node"
  );
  return cowsayPluginNode2;
}

// src/nodes/SearchAgentPluginNode.ts
function searchAgentPluginNode(rivet) {
  const SearchAgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Paper Search Agent",
        // This must match the type of your node.
        type: "searchAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Terms"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Paper Search Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Search Agent"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
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
    getBody(data) {
      return rivet.dedent`
        Agent-1: The Search Agent is the entry point into the Decentralized AI-Oncologist pipeline. Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.
        
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const searchAgentPluginNode2 = rivet.pluginNodeDefinition(
    SearchAgentPluginNodeImpl,
    "Search Agent Plugin Node"
  );
  return searchAgentPluginNode2;
}

// src/nodes/PaperReaderAgentPluginNode.ts
function paperReaderAgentPluginNode(rivet) {
  const PaperReaderPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Paper Reader Agent",
        // This must match the type of your node.
        type: "paperReaderAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "Papers",
          dataType: "string",
          title: "Papers"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Paper Reader Agent",
        group: "BioMl",
        infoBoxBody: "Its core function is to process the documents retrieved by Agent-1 (The Search Agent) at a finer granularity\u2014examining each paper paragraph-by-paragraph. The goal is to identify textual segments that potentially describe proteins, molecules, or structural features relevant to the target disease context discovered in the literature.",
        infoBoxTitle: "The Paper Reader "
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
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
    getBody(data) {
      return rivet.dedent`
       The Paper Reader 
       is the second step in the Decentralized AI-Oncologist pipeline. Its core function is to process the documents retrieved by Agent-1 (The Search Agent) at a finer granularity—examining each paper paragraph-by-paragraph. The goal is to identify textual segments that potentially describe proteins, molecules, or structural features relevant to the target disease context discovered in the literature.
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const paperReaderAgentPluginNode2 = rivet.pluginNodeDefinition(
    PaperReaderPluginNodeImpl,
    "Paper Reader Agent Plugin Node"
  );
  return paperReaderAgentPluginNode2;
}

// src/nodes/OncologistAgentPluginNode.ts
function oncologistAgentPluginNode(rivet) {
  const OncologistAgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Oncologist Agent",
        // This must match the type of your node.
        type: "oncologistAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Terms"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Oncologist Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Oncologist Agent"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
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
    getBody(data) {
      return rivet.dedent`
       Transform unstructured insights (relevant paragraphs and knowledge graphs) into a precise experimental blueprint for protein design.
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const oncologistAgentPluginNode2 = rivet.pluginNodeDefinition(
    OncologistAgentPluginNodeImpl,
    "Search Agent Plugin Node"
  );
  return oncologistAgentPluginNode2;
}

// src/nodes/ProteinDesignerAgentPluginNode.ts
function proteinDesignerAgentPluginNode(rivet) {
  const ProteinDesignerAgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!"
          // SK:""
        },
        // This is the default title of your node.
        title: "Protein Designer Agent",
        // This must match the type of your node.
        type: "proteinDesignerAgentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Terms"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Results"
        }
        // {
        //   id: "SK" as PortId,
        //   dataType: "string",
        //   title: "Secret Key",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Protein Designer Agent",
        group: "BioMl",
        infoBoxBody: "Its primary purpose is to perform a targeted literature search over a large corpus of oncology-related documents. By leveraging semantic search techniques and Retrieval Augmented Generation (RAG), this agent identifies a set of papers or excerpts most likely relevant to the oncology target in question.",
        infoBoxTitle: "The Protein Designer Agent"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
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
    getBody(data) {
      return rivet.dedent`
       TBD
      `;
    },
    // Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      const result = await fetch("https://jsonplaceholder.typicode.com/posts");
      return {
        ["someData"]: {
          type: "string",
          value: await result.text()
        }
      };
    }
  };
  const proteinDesignerAgentPluginNode2 = rivet.pluginNodeDefinition(
    ProteinDesignerAgentPluginNodeImpl,
    "Search Agent Plugin Node"
  );
  return proteinDesignerAgentPluginNode2;
}

// src/index.ts
var plugin = (rivet) => {
  const exampleNode = examplePluginNode(rivet);
  const cowsayNode = cowsayPluginNode(rivet);
  const searchNode = searchAgentPluginNode(rivet);
  const readerNode = paperReaderAgentPluginNode(rivet);
  const oncologistNode = oncologistAgentPluginNode(rivet);
  const proteinDesignerNode = proteinDesignerAgentPluginNode(rivet);
  const examplePlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "example-plugin-lp",
    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Lilypad Plugin",
    // Define all configuration settings in the configSpec object.
    configSpec: {
      sk: {
        type: "string",
        label: "Secret Key",
        description: "Paste in your secret key.",
        helperText: "Paste in your secret key."
      },
      api: {
        type: "string",
        label: "Api",
        description: "Paste in your api url.",
        helperText: "Paste in your api url."
      }
    },
    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "lilypad",
        label: "Lilypad"
      },
      {
        id: "bioml",
        label: "BioMl"
      }
    ],
    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(exampleNode);
      register(cowsayNode);
      register(searchNode);
      register(readerNode);
      register(oncologistNode);
      register(proteinDesignerNode);
    }
  };
  return examplePlugin;
};
var src_default = plugin;
export {
  src_default as default
};
