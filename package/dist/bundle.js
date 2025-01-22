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
        title: "Example",
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
        contextMenuTitle: "Example",
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
    "Example Plugin"
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
          someData: "Hello World From LP!!!!!",
          SK: "",
          prompt: "",
          stdout: "",
          stderr: ""
        },
        // This is the default title of your node.
        title: "Cowsay",
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
      console.log("data", data);
      if (data.useSomeDataInput) {
      }
      inputs.push({
        id: "prompt",
        dataType: "string",
        title: "Prompt"
      });
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "STDOUTData",
          dataType: "string",
          title: "STDOUT"
        },
        {
          id: "STDERRData",
          dataType: "string",
          title: "STDERR"
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
        contextMenuTitle: "Cowsay",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        // {
        //   type: "string",
        //   dataKey: "someData",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Some Data",
        // },
        {
          type: "string",
          dataKey: "prompt",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Prompt"
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
        Prompt:
        ${!data.prompt ? "(Using Input)" : data.prompt}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      console.log("inputData", inputData, data);
      const prompt = rivet.getInputOrData(
        data,
        inputData,
        "prompt",
        "string"
      );
      console.log("prompt1", prompt);
      const api = _context.getPluginConfig("api") || "no api url. check plugin config";
      const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
      const s = "await result ";
      const { runModuleScript: runModule } = await import("../dist/nodeEntry.cjs");
      const output = await runModule(_context, "cowsay:v0.0.4", "Message=" + prompt);
      const decodedOutput = Buffer.from(output.stdout, "base64").toString("utf-8");
      const decodedErr = Buffer.from(output.stderr, "base64").toString("utf-8");
      return {
        // ["someData" as PortId]: {
        //   type: "string",
        //   value: decodedOutput,
        // },
        ["STDOUTData"]: {
          type: "string",
          value: decodedOutput
        },
        ["STDERRData"]: {
          type: "string",
          value: decodedErr
        }
      };
    }
  };
  const cowsayPluginNode2 = rivet.pluginNodeDefinition(
    CowsayPluginNodeImpl,
    "Example Plugin"
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
    "Search Agent"
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
    "Paper Reader Agent"
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
    "Search Agent"
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
    "Search Agent"
  );
  return proteinDesignerAgentPluginNode2;
}

// src/nodes/GradioPluginNode.ts
function gradioPluginNode(rivet) {
  const GradioPluginNodeImpl = {
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
        title: "Gradio",
        // This must match the type of your node.
        type: "gradioPlugin",
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
        contextMenuTitle: "Gradio",
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
      const response = await fetch("https://bharat-raghunathan-song-lyrics-classifier.hf.space/call/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: ["Hello!!"]
        })
      });
      const { event_id } = await response.json();
      const result = await fetch(`https://bharat-raghunathan-song-lyrics-classifier.hf.space/call/predict/${event_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const text = (await result.text()).replace("data", '"data"');
      const lines = text.split("\n");
      lines.shift();
      const modifiedText = "{" + lines.join("\n") + "}";
      console.log(modifiedText);
      const resultData = JSON.parse(modifiedText);
      const value = resultData.data;
      return {
        ["someData"]: {
          type: "string",
          value: JSON.stringify(value)
        }
      };
    }
  };
  const gradioPluginNode2 = rivet.pluginNodeDefinition(
    GradioPluginNodeImpl,
    "Example Plugin"
  );
  return gradioPluginNode2;
}

// src/nodes/AgentPluginNode.ts
function agentPluginNode(rivet) {
  const AgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          module: "github.com/noryev/module-sdxl-ipfs:ae17e969cadab1c53d7cabab1927bb403f02fd2a",
          input: "prompt=cows",
          binary_path: "outputs/output.png"
        },
        // This is the default title of your node.
        title: "Agent",
        // This must match the type of your node.
        type: "agentPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      node.data.useSomeDataInput = true;
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "module",
          dataType: "string",
          title: "module"
        });
        inputs.push({
          id: "input",
          dataType: "string",
          title: "input"
        });
        inputs.push({
          id: "json",
          dataType: "string",
          title: "json"
        });
      }
      if (data.useipfsInput) {
        inputs.push({
          id: "module",
          dataType: "string",
          title: "module"
        });
        inputs.push({
          id: "input",
          dataType: "string",
          title: "input"
        });
        inputs.push({
          id: "json",
          dataType: "string",
          title: "json"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "stdout",
          dataType: "string",
          title: "stdout"
        },
        {
          id: "stderr",
          dataType: "string",
          title: "stderr"
        },
        {
          id: "binary",
          dataType: "any",
          title: "binary"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Agent",
        group: "Lilypad",
        infoBoxBody: "This a Lilypad Agent plugin node.",
        infoBoxTitle: "Agent Plugin"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "module",
          useInputToggleDataKey: "useSomeDataInput",
          label: "module"
        },
        {
          type: "string",
          dataKey: "input",
          useInputToggleDataKey: "useipfsInput",
          label: "input"
        },
        {
          type: "string",
          dataKey: "binary_path",
          useInputToggleDataKey: "useSomeDataInput",
          label: "binary path"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Module: ${data.useSomeDataInput ? "(Using Input)" : data.module}
        Input: ${data.useSomeDataInput ? "(Using Input)" : data.input}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      console.log("inputData", inputData, data);
      const input = rivet.getInputOrData(
        data,
        inputData,
        "input",
        "string"
      );
      const module = rivet.getInputOrData(
        data,
        inputData,
        "module",
        "string"
      );
      const binary_path = rivet.getInputOrData(
        data,
        inputData,
        "binary_path",
        "string"
      );
      const api = _context.getPluginConfig("api") || "no api url. check plugin config";
      const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
      const payload = {
        pk: sk,
        module,
        inputs: `-i "${input}"`,
        format: "json",
        stream: "true"
      };
      const result = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const json = await result.json();
      const decodedOutput = atob(json.stdout);
      const decodedErr = atob(json.stderr);
      let binary = null;
      if (json[binary_path] != void 0) {
        const img = atob(json[binary_path]);
        const imgBuffer = Uint8Array.from(img, (c) => c.charCodeAt(0));
        binary = imgBuffer;
      }
      return {
        ["stdout"]: {
          type: "string",
          value: decodedOutput
        },
        ["stderr"]: {
          type: "string",
          value: decodedErr
        },
        ["binary"]: {
          type: "any",
          value: binary
        }
      };
    }
  };
  const agentPluginNode2 = rivet.pluginNodeDefinition(
    AgentPluginNodeImpl,
    "Agent Plugin"
  );
  return agentPluginNode2;
}

// src/nodes/MediaPluginNode.ts
function mediaPluginNode(rivet) {
  const MediaPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        data: {
          useDataInput: false,
          mediaType: "image/png",
          useMediaTypeInput: false
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
          width: 400
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
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
    getUIData() {
      return {
        contextMenuTitle: "Media",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Media Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data, context) {
      console.log(context.project);
      return [
        {
          type: "fileBrowser",
          dataKey: "data",
          mediaTypeDataKey: "mediaType",
          useInputToggleDataKey: "useDataInput",
          label: "File Path"
        }
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
    getBody(data, c) {
      let y = rivet.getInputOrData(data, c, "data", "object");
      console.log("rivet", rivet);
      let _context = c;
      let ui = _context;
      console.log("this", data);
      console.log("ui", ui);
      console.log(data);
      console.log(_context);
      this.process(data, c.inputs, c);
      return {
        type: "markdown",
        text: `<iframe id="asdf" 
              onload="try {
                  // const doc = this.contentDocument || this.contentWindow.document;
                  // console.log(getElementById('asdf').src);
                  // console.log(this.getElementById('iframe').contentWindow.document.body.scrollHeight);
                  this.style.height = 100 + 'px';
                  //  console.log(this.height =1000);
                  //  console.log(doc.documentElement.scrollHeight);
               } catch (e) {
                   console.error('Unable to access iframe content:', e);
               }"
              frameborder="0"  
              width="100%" 
              src="about:blank"
              />
              `
      };
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    /*
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
              value:encodedData,
            },
          };
        },
      */
    async process(data, inputData, context) {
      let mediaType;
      const ref = data.data?.refId;
      console.log("ref", ref);
      const encodedData = context.project.data?.[ref];
      console.log(encodedData);
      let d = base64ToUint8Array(encodedData);
      mediaType = "image/png";
      console.log("d", d);
      return {
        ["image"]: {
          type: "image",
          value: { mediaType, data: d }
        }
      };
    }
  };
  function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array;
  }
  const mediaPluginNode2 = rivet.pluginNodeDefinition(
    MediaPluginNodeImpl,
    "Media Plugin"
  );
  return mediaPluginNode2;
}

// src/nodes/IpfsPluginNode.ts
function ipfsPluginNode(rivet) {
  const IpfsPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const id = rivet.newId();
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id,
        // This is the default data that your node will store
        data: {
          someData: "Hello World From LP!!!",
          SK: "",
          id
        },
        // This is the default title of your node.
        title: "Ipfs",
        // This must match the type of your node.
        type: "ipfsPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 400
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      const filteredNodes = Object.values(_connections).filter((node) => node.inputNodeId === data.id);
      for (let i = 1; i <= filteredNodes.length + 1; i++) {
        inputs.push({
          dataType: "any",
          id: `input${i}`,
          title: `Input ${i}`,
          description: 'An input to create the array from. If an array, will be flattened if the "Flatten" option is enabled.'
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
          title: "Content"
        },
        {
          id: "cid",
          dataType: "string",
          title: "CID"
        },
        {
          id: "url",
          dataType: "string",
          title: "URL"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Ipfs",
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
      async function addFileToIPFS(file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("http://localhost:5001/api/v0/add", {
          // mode: "no-cors",
          method: "POST",
          body: formData
        });
      }
      console.log(inputData);
      let outputFileName = "defaultFileName";
      let cid_out = await (async () => {
        const inputCount = Object.keys(inputData).filter((key) => key.startsWith("input")).length;
        const formData = new FormData();
        function getMimeTypeFromDataURL(uint8Array) {
          const blob = new Blob(uint8Array);
          const reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.onloadend = () => {
              const base64String = reader.result.toString().split(",")[1];
              const text = atob(base64String);
              console.log("Words", text);
              const dataURL = reader.result;
              const mimeType = typeof dataURL === "string" ? dataURL.match(/^data:(.*?);/)?.[1] || "unknown" : "unknown";
              resolve(mimeType);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
        for (let i = 1; i <= inputCount; i++) {
          const input = inputData[`input${i}`];
          const val = input.value;
          const t = input.type;
          const mimeType = val.mediaType || "application/octet-stream";
          console.log("mimetype", mimeType);
          if (val instanceof Uint8Array) {
            const file = new Blob([val], { type: mimeType });
            if ("application/octet-stream" !== mimeType) {
              const extension = mimeType.split("/")[1];
              formData.append("file", file, `input${i}.${extension}`);
            } else {
              formData.append("file", file, `input${i}`);
            }
          } else {
            const file = new Blob([val], { type: "text/plain" });
            formData.append("file", file, `input${i}.txt`);
          }
        }
        outputFileName = formData.get("file")?.name || "defaultFileName";
        let return_cid;
        const response = await fetch("http://localhost:5001/api/v0/add?wrap-with-directory=true", {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let txt = (await response.text()).trim().split("\n");
        console.log("IPFS Response:\n", JSON.parse(txt[txt.length - 1]));
        const result = JSON.parse(txt[txt.length - 1]);
        console.log(result);
        return_cid = result.Hash;
        const params = {
          arg: ["/ipfs/" + result.Hash, ""]
        };
        const paramsSerializer = (params2) => {
          return Object.keys(params2).map((key) => {
            const value = params2[key];
            if (Array.isArray(value)) {
              return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          }).join("&");
        };
        const cid = result.Hash;
        const fileName = "files";
        const checkUrl = new URL("http://localhost:5001/api/v0/files/stat");
        checkUrl.search = paramsSerializer({
          arg: ["/" + fileName]
        });
        const checkResponse = await fetch(checkUrl.toString(), {
          method: "POST"
        });
        if (checkResponse.ok) {
          console.log(`File ${fileName} already exists.`);
        } else {
          const url = new URL("http://localhost:5001/api/v0/files/cp");
          url.search = paramsSerializer({
            arg: ["/ipfs/" + cid, "/" + fileName]
          });
          const copyResponse = await fetch(url.toString(), {
            method: "POST"
          });
          if (!copyResponse.ok) {
            throw new Error(`HTTP error! Status: ${copyResponse.status}`);
          }
          const copyResult = await copyResponse.text();
          console.log("IPFS Copy Response:", copyResult);
          console.log("IPFS Response:", result);
        }
        try {
        } catch (error) {
          console.error("Error:", error);
        }
        return return_cid;
      })();
      return {
        ["cid"]: {
          type: "string",
          value: cid_out
        },
        ["url"]: {
          type: "string",
          value: "http://127.0.0.1:8082/ipfs/" + cid_out + "/" + outputFileName
        }
      };
    }
  };
  const ipfsPluginNode2 = rivet.pluginNodeDefinition(
    IpfsPluginNodeImpl,
    "Ipfs Plugin"
  );
  return ipfsPluginNode2;
}

// src/nodes/WalletPluginNode.ts
function walletPluginNode(rivet) {
  const WalletPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          LP: "23",
          ETH: "12"
        },
        // This is the default title of your node.
        title: "Wallet",
        // This must match the type of your node.
        type: "walletPlugin",
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
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        // {
        //   id: "someData" as PortId,
        //   dataType: "string",
        //   title: "Some Data",
        // },
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
        contextMenuTitle: "Wallet",
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
          dataKey: "LP",
          useInputToggleDataKey: "useSomeDataInput",
          label: "LP"
        },
        {
          type: "string",
          dataKey: "ETH",
          useInputToggleDataKey: "useSomeDataInput",
          label: "ETH"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`

        LP: ${data.useSomeDataInput ? "(Using Input)" : data.ETH}
        LP: ${data.useSomeDataInput ? "(Using Input)" : data.LP}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "LP",
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
  const walletPluginNode2 = rivet.pluginNodeDefinition(
    WalletPluginNodeImpl,
    "Wallet Plugin"
  );
  return walletPluginNode2;
}

// src/nodes/RealtimeAgentPluginNode.ts
function realtimeagentPluginNode(rivet) {
  const RealtimeAgentPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          module: "github.com/noryev/module-sdxl-ipfs:ae17e969cadab1c53d7cabab1927bb403f02fd2a",
          input: "prompt=cow",
          binary_path: "outputs/output.png"
        },
        // This is the default title of your node.
        title: "Realtime Agent",
        // This must match the type of your node.
        type: "realtimeagentPlugin",
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
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "stdout",
          dataType: "string",
          title: "URL"
        }
        // {
        //   id: "stderr" as PortId,
        //   dataType: "string",
        //   title: "stderr",
        // },
        // {
        //   id: "binary" as PortId,
        //   dataType: "any",
        //   title: "binary",
        // },
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Realtime Agent",
        group: "Lilypad",
        infoBoxBody: "This a Lilypad Realtime Agent plugin node.",
        infoBoxTitle: "Realtime Agent Plugin"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        // {
        //   type: "string",
        //   dataKey: "module",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "module",
        // },
        // {
        //   type: "string",
        //   dataKey: "input",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "input",
        // },
        // {
        //   type: "string",
        //   dataKey: "binary_path",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "binary path",
        // },
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      const b = { type: "markdown", text: `<iframe onload="console.log(parent.postMessage('test'))" frameborder="0"  height="100%"  width="100%" src=https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4 />[![Watch the video](https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4)](https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4)` };
      return b;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      console.log("inputData", inputData, data);
      const input = rivet.getInputOrData(
        data,
        inputData,
        "input",
        "string"
      );
      const module = rivet.getInputOrData(
        data,
        inputData,
        "module",
        "string"
      );
      const binary_path = rivet.getInputOrData(
        data,
        inputData,
        "binary_path",
        "string"
      );
      const api = _context.getPluginConfig("api") || "no api url. check plugin config";
      const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
      const payload = {
        pk: sk,
        module,
        inputs: `-i "${input}"`,
        format: "json",
        stream: "true"
      };
      const result = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const json = await result.json();
      const decodedOutput = atob(json.stdout);
      const decodedErr = atob(json.stderr);
      let binary = null;
      if (json[binary_path] != void 0) {
        const img = atob(json[binary_path]);
        const imgBuffer = Uint8Array.from(img, (c) => c.charCodeAt(0));
        binary = imgBuffer;
      }
      return {
        ["stdout"]: {
          type: "string",
          value: decodedOutput
        },
        ["stderr"]: {
          type: "string",
          value: decodedErr
        },
        ["binary"]: {
          type: "any",
          value: binary
        }
      };
    }
  };
  const realtimeagentPluginNode2 = rivet.pluginNodeDefinition(
    RealtimeAgentPluginNodeImpl,
    "RealtimeAgent Plugin"
  );
  return realtimeagentPluginNode2;
}

// src/nodes/ModulePluginNode.ts
function modulePluginNode(rivet) {
  const ModulePluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const id = rivet.newId();
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id,
        // This is the default data that your node will store
        data: {
          cidInput: true,
          module: "github.com/arsen3d/audioface_module:main",
          input: "",
          binary_path: "outputs/output.png",
          id
        },
        // This is the default title of your node.
        title: "Module",
        // This must match the type of your node.
        type: "modulePlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      node.data.useSomeDataInput = true;
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.cidInput) {
        inputs.push({
          dataType: "string",
          id: "cid",
          title: "CID",
          description: "The CID of the file to be processed."
        });
      } else {
        const filteredNodes = Object.values(_connections).filter((node) => node.inputNodeId === data.id);
        for (let i = 1; i <= filteredNodes.length + 1; i++) {
          inputs.push({
            dataType: "any",
            id: `input${i}`,
            title: `Input ${i}`,
            description: 'An input to create the array from. If an array, will be flattened if the "Flatten" option is enabled.'
          });
        }
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        // {
        //   id: "stdout" as PortId,
        //   dataType: "string",
        //   title: "stdout",
        // },
        // {
        //   id: "stderr" as PortId,
        //   dataType: "string",
        //   title: "stderr",
        // },
        // {
        //   id: "binary" as PortId,
        //   dataType: "any",
        //   title: "binary",
        // },
        {
          id: "ipfs_out",
          dataType: "string",
          title: "ipfs"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Module",
        group: "Lilypad",
        infoBoxBody: "This a Lilypad Module plugin node.",
        infoBoxTitle: "Module Plugin"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data, context) {
      console.log("_data", _data);
      console.log("context", context);
      return [
        {
          type: "toggle",
          dataKey: "cidInput",
          label: "CID Input"
        },
        {
          type: "string",
          dataKey: "module",
          useInputToggleDataKey: "useSomeDataInput",
          label: "module"
        },
        // {
        //   type: "string",
        //   dataKey: "input",
        //   useInputToggleDataKey: "useipfsInput",
        //   label: "input",
        // },
        {
          type: "string",
          dataKey: "binary_path",
          useInputToggleDataKey: "useSomeDataInput",
          label: "binary path"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return ` ${data.module}`;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const api = _context.getPluginConfig("api") || "no api url. check plugin config";
      const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
      const cid = inputData["cid"].value;
      console.log("cid", cid);
      console.log("data.module", data.module);
      const payload = {
        pk: sk,
        module: data.module,
        // inputs: `-i "ENV=IPFS=${cid_out}"`,
        inputs: `-i "ENV=IPFS=${cid}"`,
        format: "ipfs",
        stream: "true"
      };
      console.log("payload", payload);
      const result = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const json = await result.json();
      console.log("json", json);
      const parentCid = json.results[json.results.length - 1].cid;
      window.open("http://127.0.0.1:8082/ipfs/" + parentCid);
      return {
        // ["stdout" as PortId]: {
        //   type: "string",
        //   value: decodedOutput,
        // },
        // ["stderr" as PortId]: {
        //   type: "string",
        //   value: decodedErr,
        // },
        // ["binary" as PortId]: {
        //   type: "any",
        //   value: binary,
        // },
        ["ipfs"]: {
          type: "string",
          value: parentCid
        }
      };
      async function saveResults() {
        const binary_path = "";
        const json2 = await result.json();
        const decodedOutput = atob(json2.stdout);
        const decodedErr = atob(json2.stderr);
        let binary = null;
        if (json2[binary_path] != void 0) {
          const img = atob(json2[binary_path]);
          const imgBuffer = Uint8Array.from(img, (c) => c.charCodeAt(0));
          binary = imgBuffer;
        }
        let ipfs_result = "";
        let outputFileName = "defaultFileName";
        if (json2.files) {
          const files = json2.files;
          const formData = new FormData();
          for (const filePath in files) {
            if (files.hasOwnProperty(filePath)) {
              const base64Data = files[filePath];
              const binaryData = atob(base64Data);
              const byteArray = Uint8Array.from(binaryData, (char) => char.charCodeAt(0));
              const blob = new Blob([byteArray]);
              formData.append("file", blob, filePath);
            }
          }
          const response = await fetch("http://localhost:5001/api/v0/add?wrap-with-directory=true", {
            method: "POST",
            body: formData
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const text = await response.text();
          const lines = text.trim().split("\n");
          const result2 = JSON.parse(lines[lines.length - 1]);
          ipfs_result = result2.Hash;
          outputFileName = formData.get("file")?.name || "defaultFileName";
        }
        return { ipfs_result, outputFileName, decodedOutput, decodedErr, binary };
      }
      async function GetDataInputs() {
        async function addFileToIPFS(file) {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("http://localhost:5001/api/v0/add", {
            // mode: "no-cors",
            method: "POST",
            body: formData
          });
        }
        console.log(inputData);
        let cid_out = await (async () => {
          const inputCount = Object.keys(inputData).filter((key) => key.startsWith("input")).length;
          const formData = new FormData();
          for (let i = 1; i <= inputCount; i++) {
            const input2 = inputData[`input${i}`];
            const val = input2.value;
            const t = input2.type;
            console.log("val", val);
            console.log("Type of val:", typeof val);
            if (val instanceof Object && typeof t === "string") {
              const file = new Blob([val.data], { type: val.mediaType });
              const extension = val.mediaType.split("/")[1];
              formData.append("file", file, `input${i}.${extension}`);
            } else {
              const file = new Blob([val], { type: "text/plain" });
              formData.append("file", file, `input${i}.txt`);
            }
          }
          let return_cid;
          const response = await fetch("http://localhost:5001/api/v0/add?wrap-with-directory=true", {
            method: "POST",
            body: formData
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          let txt = (await response.text()).trim().split("\n");
          console.log("IPFS Response:\n", JSON.parse(txt[txt.length - 1]));
          const result2 = JSON.parse(txt[txt.length - 1]);
          console.log(result2);
          return_cid = result2.Hash;
          const params = {
            arg: ["/ipfs/" + result2.Hash, ""]
          };
          const paramsSerializer = (params2) => {
            return Object.keys(params2).map((key) => {
              const value = params2[key];
              if (Array.isArray(value)) {
                return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
              }
              return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }).join("&");
          };
          const cid2 = result2.Hash;
          const fileName = result2.Hash;
          const checkUrl = new URL("http://localhost:5001/api/v0/files/stat");
          checkUrl.search = paramsSerializer({
            arg: ["/" + fileName]
          });
          const checkResponse = await fetch(checkUrl.toString(), {
            method: "POST"
          });
          if (checkResponse.ok) {
            console.log(`File ${fileName} already exists.`);
            const rmUrl = new URL("http://localhost:5001/api/v0/files/rm");
            rmUrl.search = paramsSerializer({
              arg: ["/" + fileName],
              recursive: "true"
            });
            const rmResponse = await fetch(rmUrl.toString(), {
              method: "POST"
            });
            if (!rmResponse.ok) {
              throw new Error(`HTTP error! Status: ${rmResponse.status}`);
            }
            const rmResult = await rmResponse.text();
            console.log("IPFS Remove Response:", rmResult);
          }
          const url = new URL("http://localhost:5001/api/v0/files/cp");
          url.search = paramsSerializer({
            arg: ["/ipfs/" + cid2, "/" + fileName]
          });
          const copyResponse = await fetch(url.toString(), {
            method: "POST"
          });
          if (!copyResponse.ok) {
            throw new Error(`HTTP error! Status: ${copyResponse.status}`);
          }
          const copyResult = await copyResponse.text();
          console.log("IPFS Copy Response:", copyResult);
          console.log("IPFS Response:", result2);
          try {
          } catch (error) {
            console.error("Error:", error);
          }
          return return_cid;
        })();
        console.log("inputData", inputData, data);
        const input = rivet.getInputOrData(
          data,
          inputData,
          "input",
          "string"
        );
        const module = rivet.getInputOrData(
          data,
          inputData,
          "module",
          "string"
        );
        const binary_path = rivet.getInputOrData(
          data,
          inputData,
          "binary_path",
          "string"
        );
        return { module, cid_out, binary_path };
      }
    }
  };
  const modulePluginNode2 = rivet.pluginNodeDefinition(
    ModulePluginNodeImpl,
    "Module Plugin"
  );
  return modulePluginNode2;
}

// src/nodes/IframePluginNode.ts
function iframePluginNode(rivet) {
  const IframePluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        data: {
          url: "https://jsonplaceholder.typicode.com/posts"
          // useDataInput: false,
          // mediaType: 'image/png',
          // useMediaTypeInput: false,
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
        title: "Iframe",
        // This must match the type of your node.
        type: "iframePlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 400
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      inputs.push({
        id: "url",
        dataType: "string",
        title: "URL"
      });
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "image",
          dataType: "string",
          title: "Image"
        }
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
    getUIData() {
      return {
        contextMenuTitle: "Iframe",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Iframe Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data, context) {
      console.log(context.project);
      return [
        {
          type: "string",
          dataKey: "url",
          // useInputToggleDataKey: "useDataInput",
          // useInputToggleDataKey: "useDataInput",
          label: "URL"
          // type: "fileBrowser",
          // dataKey: "data",
          // mediaTypeDataKey: "mediaType",
          // useInputToggleDataKey: "useDataInput",
          // label: "File Path",
        }
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
    getBody(data, c) {
      let y = rivet.getInputOrData(data, c, "url", "object");
      console.log("rivet", rivet);
      let _context = c;
      let ui = _context;
      console.log("this", data);
      console.log("ui", ui);
      console.log(data);
      console.log(_context);
      console.log("y", y);
      return {
        type: "markdown",
        text: `<iframe id="asdf" 
              onload="try {
                  // const doc = this.contentDocument || this.contentWindow.document;
                  // console.log(getElementById('asdf').src);
                  // console.log(this.getElementById('iframe').contentWindow.document.body.scrollHeight);
                  this.style.height = 100 + 'px';
                  //  console.log(this.height =1000);
                  //  console.log(doc.documentElement.scrollHeight);
               } catch (e) {
                   console.error('Unable to access iframe content:', e);
               }"
              frameborder="0"  
              width="100%" 
              src="${y}"
              />
              `
      };
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    /*
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
              value:encodedData,
            },
          };
        },
      */
    async process(data, inputData, context) {
      window.open(inputData["url"].value);
      return {
        ["url"]: {
          type: "string",
          value: inputData["url"].value
        }
      };
    }
  };
  function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array;
  }
  const iframePluginNode2 = rivet.pluginNodeDefinition(
    IframePluginNodeImpl,
    "Iframe Plugin"
  );
  return iframePluginNode2;
}

// src/nodes/SDXLPluginNode.ts
function sdxlPluginNode(rivet) {
  const SDXLPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          openWindow: true,
          someData: "Hello World From LP!!!!!",
          SK: "",
          prompt: "",
          stdout: "",
          stderr: ""
        },
        // This is the default title of your node.
        title: "SDXL",
        // This must match the type of your node.
        type: "sdxlPlugin",
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
      console.log("data", data);
      if (data.useSomeDataInput) {
      }
      inputs.push({
        id: "prompt",
        dataType: "string",
        title: "Prompt"
      });
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "IPFS",
          dataType: "string",
          title: "IPFS"
        }
        // {
        //   id: "STDERRData" as PortId,
        //   dataType: "string",
        //   title: "STDERR",
        // },
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
        contextMenuTitle: "SDXL",
        group: "Lilypad",
        infoBoxBody: "This is an example plugin node.",
        infoBoxTitle: "Example Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        // {
        //   type: "string",
        //   dataKey: "someData",
        //   useInputToggleDataKey: "useSomeDataInput",
        //   label: "Some Data",
        // },
        {
          type: "toggle",
          dataKey: "openWindow",
          label: "Open Result"
        },
        {
          type: "string",
          dataKey: "prompt",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Prompt"
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
        Prompt:
        ${!data.prompt ? "(Using Input)" : data.prompt}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      console.log("inputData", inputData, data);
      const prompt = rivet.getInputOrData(
        data,
        inputData,
        "prompt",
        "string"
      );
      console.log("prompt1", prompt);
      const api = _context.getPluginConfig("api") || "no api url. check plugin config";
      const sk = _context.getPluginConfig("sk") || "no sk url check plugin config";
      const lilypad_module = "cowsay:v0.0.4";
      const payload = {
        pk: sk,
        module: lilypad_module,
        inputs: `-i "Message=${prompt}"`,
        format: "ipfs",
        stream: "true"
      };
      console.log("payload", payload);
      const result = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const json = await result.json();
      console.log("json", json);
      const parentCid = json.results[json.results.length - 1].cid;
      console.log("result", parentCid);
      if (data.openWindow) {
        window.open("http://127.0.0.1:8082/ipfs/" + parentCid);
      }
      return {
        // ["someData" as PortId]: {
        //   type: "string",
        //   value: decodedOutput,
        // },
        // ["STDOUTData" as PortId]: {
        //   type: "string",
        //   value: decodedOutput,
        // },
        ["IPFS"]: {
          type: "string",
          value: parentCid
        }
      };
    }
  };
  const sdxlPluginNode2 = rivet.pluginNodeDefinition(
    SDXLPluginNodeImpl,
    "Example Plugin"
  );
  return sdxlPluginNode2;
}

// src/index.ts
console.log("Hello from Lilypad Plugin!!!");
var plugin = (rivet) => {
  const exampleNode = examplePluginNode(rivet);
  const cowsayNode = cowsayPluginNode(rivet);
  const searchNode = searchAgentPluginNode(rivet);
  const readerNode = paperReaderAgentPluginNode(rivet);
  const oncologistNode = oncologistAgentPluginNode(rivet);
  const proteinDesignerNode = proteinDesignerAgentPluginNode(rivet);
  const gradionNode = gradioPluginNode(rivet);
  const agentNode = agentPluginNode(rivet);
  const mediaNode = mediaPluginNode(rivet);
  const ipfsNode = ipfsPluginNode(rivet);
  const walletsNode = walletPluginNode(rivet);
  const realtimeagentNode = realtimeagentPluginNode(rivet);
  const moduleNode = modulePluginNode(rivet);
  const iframeNode = iframePluginNode(rivet);
  const sdxlNode = sdxlPluginNode(rivet);
  const lilypadRivetPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "lilypad-rivet",
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
      register(gradionNode);
      register(agentNode);
      register(mediaNode);
      register(ipfsNode);
      register(walletsNode);
      register(realtimeagentNode);
      register(moduleNode);
      register(iframeNode);
      register(sdxlNode);
    }
  };
  return lilypadRivetPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
